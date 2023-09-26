import dotenv from 'dotenv'
dotenv.config()

export const GITHUB_API_TOKEN = process.env.GITHUB_API_TOKEN || ''
export const GITHUB_PAGINATION_LIMIT = 1000
