import { Service } from "typedi";
import { PermissionModel } from "../data-access/models/permission.model";
import { PermissionRepository } from "../data-access/repositories/PermissionRepository";

@Service()
export class PermissionService {
    private readonly permissionRepository: PermissionRepository;

    constructor() {
        // TODO: implement DI
        this.permissionRepository = new PermissionRepository(PermissionModel);
    }

    async getPermissions(userId: number): Promise<PermissionModel[]> {
        return this.permissionRepository.getAll();
    }
}