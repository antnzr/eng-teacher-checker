import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { catchError, lastValueFrom, map, throwError, timeout } from 'rxjs';
import { TeacherAvailableTime, TeacherDateDto } from './dto';
import { DEFAULT_TIMEOUT } from '../constants';
import { AxiosResponse } from 'axios';
import parse, { HTMLElement } from 'node-html-parser';

type HTMLString = string;

@Injectable()
export class LevelEngService {
  constructor(private readonly httpService: HttpService) {}

  async getAvailableSlots(
    dto: TeacherDateDto,
  ): Promise<TeacherAvailableTime | null> {
    const html = await this.getTeacherSchedule(dto);
    const root = parse(html);

    const availableSlots = root.querySelectorAll('.slot-available');
    if (!availableSlots?.length) return null;

    return availableSlots.reduce(
      (acc: TeacherAvailableTime, slot: HTMLElement) => {
        const time = this.extractTime(slot.innerHTML);
        if (!time) return acc;
        acc.time.push(time);
        return acc;
      },
      { time: [] },
    );
  }

  /**
   * @example
   *    <div>🕙 17:00 → 17:50</div>
   *    <div class="calendar_tutor-name">
   *      <i class="fa fa-user" aria-hidden="true"></i><strong>Преподаватель                   :</strong> Arniel                                </div>
   *    <div class="calendar_student-name"><strong>Student:</strong> </div>
   *    <span class="slot-status slot-status--booked">Забронирован</span>
   */
  private extractTime(htmlStr: string): string | null {
    const root = parse(htmlStr);
    const divs = root.getElementsByTagName('div');
    if (!divs?.length) return null;
    return divs[0]?.text;
  }

  private async getTeacherSchedule(dto: TeacherDateDto): Promise<HTMLString> {
    return lastValueFrom(
      this.httpService
        .get(`/tutors/${dto.teacher}/daily-schedule/?date=${dto.date}`)
        .pipe(map((response: AxiosResponse) => response.data as HTMLString))
        .pipe(timeout(DEFAULT_TIMEOUT))
        .pipe(
          catchError((error) =>
            throwError(
              () =>
                new Error(
                  `Failed to get teacher's schedule. Error: ${error.message}`,
                ),
            ),
          ),
        ),
    );
  }
}
