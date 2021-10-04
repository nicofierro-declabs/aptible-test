import { Service } from "typedi";
import { PracticeModel } from "../models/practice.model";
import { BaseRepository } from "./BaseRepository";

@Service()
export class PracticeRepository extends BaseRepository<PracticeModel> { }