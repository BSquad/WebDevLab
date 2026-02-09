import type { User } from '../../../shared/models/user.ts';
import { Db } from '../db.js';

export class AuthDbAccess {
    private db: Db = new Db();
}
