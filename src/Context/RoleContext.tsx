import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

type Role = "user" | "provider";

type RoleContextType = {
    activeRole: Role;
    availableRoles: Role[];
    switchRole: (role: Role) => void;
};

const RoleContext = createContext<RoleContextType | null>(null);

export const RoleProvider = ({ children }: { children: React.ReactNode }) => {
    const { user, isLoggedIn, loading } = useAuth();

    // Initialize with 'user' or whatever is in localStorage
    const [activeRole, setActiveRole] = useState<Role>(() => {
        const stored = localStorage.getItem("activeRole");
        return (stored as Role) || "user";
    });

    const [availableRoles, setAvailableRoles] = useState<Role[]>(["user"]);

    useEffect(() => {
        if (loading) return;
        if (isLoggedIn && user) {
            // In a real app, you would fetch the available roles from the backend
            // `GET /api/roles/available`
            // For now, we'll derive it from the user object if available, or just mock it.
            // E.g. we might have user.user_roles or user.role
            const roles = user.user_roles || (user.role ? [user.role] : ["user"]);
            setAvailableRoles(roles as Role[]);

            // If active role is not in available roles, reset it
            if (!roles.includes(activeRole)) {
                setActiveRole(roles[0] as Role);
                localStorage.setItem("activeRole", roles[0]);
            }
        } else if (!isLoggedIn) {
            setAvailableRoles(["user"]);
            setActiveRole("user");
            localStorage.removeItem("activeRole");
        }
    }, [isLoggedIn, user, activeRole]);

    const switchRole = (role: Role) => {
        if (availableRoles.includes(role)) {
            setActiveRole(role);
            localStorage.setItem("activeRole", role);
        }
    };

    return (
        <RoleContext.Provider value={{ activeRole, availableRoles, switchRole }}>
            {children}
        </RoleContext.Provider>
    );
};

export const useRole = () => {
    const context = useContext(RoleContext);
    if (!context) {
        throw new Error("useRole must be used inside a RoleProvider");
    }
    return context;
};
