/**
 * src/utils/cookies.js
 * 
 * Cookie management utilities for storing and retrieving user progress.
 * No external dependencies - uses native browser cookie API.
 * 
 * Cookies are automatically parsed/stringified as JSON.
 * Default expiration is 365 days.
 */

/**
 * Set a cookie with automatic JSON serialization.
 * 
 * @param {string} name - Cookie name
 * @param {*} value - Value to store (will be JSON stringified)
 * @param {number} days - Days until expiration (default: 365)
 */
export function setCookie(name, value, days = 365) {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(JSON.stringify(value))}; expires=${expires}; path=/`;
}

/**
 * Get a cookie with automatic JSON deserialization.
 * 
 * @param {string} name - Cookie name
 * @returns {*} Parsed cookie value or null if not found
 */
export function getCookie(name) {
    const cookies = document.cookie ? document.cookie.split('; ') : [];
    for (let i = 0; i < cookies.length; i++) {
        const parts = cookies[i].split('=');
        const key = decodeURIComponent(parts.shift());
        if (key === name) {
            try {
                return JSON.parse(decodeURIComponent(parts.join('=')));
            } catch {
                return null;
            }
        }
    }   
    return null;
}

/**
 * Delete a cookie by setting expiration to epoch.
 * 
 * @param {string} name - Cookie name to delete
 */
export function deleteCookie(name) {
    document.cookie = `${encodeURIComponent(name)}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
}