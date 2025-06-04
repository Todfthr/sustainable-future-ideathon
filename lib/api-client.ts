import type { RegistrationData } from "./validations/registration"

export class ApiClient {
  private baseUrl: string

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || ""
  }

  async register(data: RegistrationData) {
    const response = await fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.error || "Registration failed")
    }

    return result
  }

  async checkAvailability(type: "email" | "teamName", value: string) {
    const response = await fetch("/api/check-availability", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ type, value }),
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.error || "Availability check failed")
    }

    return result
  }

  async getThemes() {
    const response = await fetch("/api/themes")
    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.error || "Failed to fetch themes")
    }

    return result.data
  }
}

export const apiClient = new ApiClient()
