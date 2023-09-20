import { Octokit } from 'octokit'
import { GITHUB_API_TOKEN } from './constants.js'

export const octokit = new Octokit({
	auth: GITHUB_API_TOKEN,
	retry: { enabled: false },
	throttle: { enabled: false },
})
