import { Octokit } from 'octokit'
import { GITHUB_API_TOKEN } from './constants'

export const octokit = new Octokit({
	auth: GITHUB_API_TOKEN,
})
