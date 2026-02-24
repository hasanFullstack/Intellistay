import { protect, allowRoles } from "./role.middleware.js";

// Convenience middleware for common role checks
export const ownerOnly = allowRoles("owner");
export const adminOnly = allowRoles("admin");

export { protect };
