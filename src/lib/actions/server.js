const baseURL = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "");

export const serverMutation = async (path, method, data) => {
    try {
        const response = await fetch(`${baseURL}${path}`, {
            method,
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            const result = await response.json();
            return { ...result, success: response.ok };
        } else {
            const text = await response.text();
            return { success: false, message: response.statusText, status: response.status, detail: text };
        }
    } catch (error) {
        return { success: false, message: error.message };
    }
}

export const serverQuery = async (path) => {
    const response = await fetch(`${baseURL}${path}`);
    const result = await response.json();
    return result;
}

export const getAllUsers = async () => {
    return serverQuery("/dashboard/all-users")
}

export const getAllBloodDonationRequest = async () => {
    return serverQuery("/dashboard/all-blood-donation-request")
}

export const getDonationRequestById = async (id) => {
    return serverQuery(`/dashboard/donation-request/${id}`)
}

export const deleteDonationRequest = async (id) => {
    return serverMutation(`/dashboard/donation-request/${id}`, "DELETE")
}

export const updateDonationRequest = async (id, data) => {
    return serverMutation(`/dashboard/donation-request-status/${id}`, "PATCH", data)
}

export const editDonationRequest = async (id, data) => {
    return serverMutation(`/dashboard/donation-request/${id}`, "PATCH", data)
}

export const profileUpdate = async (data) => {
    return serverMutation("/dashboard/profile", "PATCH", data)
}

export const updateStatus = async (data) => {
    return serverMutation("/dashboard/user-status", "PATCH", data)
}

export const updateRole = async (data) => {
    return serverMutation("/dashboard/user-role", "PATCH", data)
}

export const filteredUsersByStatus = async (status) => {
    return serverQuery(`/dashboard/all-users?status=${status}`)
}