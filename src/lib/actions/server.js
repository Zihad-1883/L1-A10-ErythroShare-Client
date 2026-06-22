const baseURL = process.env.NEXT_PUBLIC_API_URL;

export const serverMutation = async (path, method, data) => {
    const response = await fetch(`${baseURL}${path}`, {
        method,
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
    const result = await response.json();
    return { ...result, success: response.ok };
}

export const serverQuery = async (path) => {
    const response = await fetch(`${baseURL}${path}`);
    const result = await response.json();
    return result;
}
