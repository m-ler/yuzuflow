import dotenv from 'dotenv'
dotenv.config()

export const GITHUB_API_TOKEN = process.env.GITHUB_API_TOKEN || ''

export const YUZU_MAINLINE_REPO_URL = 'repos/yuzu-emu/yuzu-mainline/releases'
export const YUZU_EA_REPO_URL = 'repos/pineappleEA/pineapple-src/releases'
export const GITHUB_PAGINATION_LIMIT = 1000
