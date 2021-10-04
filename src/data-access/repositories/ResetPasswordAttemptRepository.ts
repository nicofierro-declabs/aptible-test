/* eslint-disable class-methods-use-this */
import { Service } from 'typedi';
import { ResetPasswordAttemptModel } from '../models/reset_password_attempt.model';
import { BaseRepository } from './BaseRepository';

@Service()
export class ResetPasswordAttemptRepository extends BaseRepository<ResetPasswordAttemptModel> {
  async findByGiud(guid: string): Promise<ResetPasswordAttemptModel> {
    return ResetPasswordAttemptModel.query().findOne('guid', '=', guid);
  }
}