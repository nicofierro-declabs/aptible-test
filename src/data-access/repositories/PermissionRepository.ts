import { Service } from "typedi";
import { PermissionModel } from "../models/permission.model";
import { BaseRepository } from "./BaseRepository";

@Service()
export class PermissionRepository extends BaseRepository<PermissionModel> { }