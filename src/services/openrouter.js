/**
 * OpenRouter API service
 * All actual API calls are made on the backend — this just calls our Express /api endpoint.
 */

const BASE_URL = '/api'

/**
 * @param {string} code - The code snippet to explain
 * @param {string} language - The programming language label
 * @returns {Promise<Object>} Parsed explanation object
 */
export async function explainCode(code, language) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 60000)

  try {
    const response = await fetch(`${BASE_URL}/explain`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, language }),
      signal: controller.signal,
    })

    clearTimeout(timeout)

    if (!response.ok) {
      const err = await response.json().catch(() => ({ message: 'Unknown server error' }))
      throw new Error(err.message || `Server error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    clearTimeout(timeout)
    if (error.name === 'AbortError') {
      throw new Error('Request timed out. Please try again.')
    }
    throw error
  }
}
