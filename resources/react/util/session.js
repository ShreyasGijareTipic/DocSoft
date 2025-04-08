/**
 * Stores user data in sessionStorage.
 *
 * @param {object} userData - The user data to store.
 */
export function storeUserData(userData) {
  sessionStorage.setItem('userData', JSON.stringify(userData))
  console.log(userData);
}

/**
 * Deletes user data from sessionStorage.
 */
export function deleteUserData() {
  sessionStorage.removeItem('userData')
}

export function isLogIn() {
  return !!sessionStorage.getItem('userData')
}




export function getToken() {
  const userData = JSON.parse(sessionStorage.getItem('userData'))
  return userData ? userData.token : null
}




export function getUserType() {
  const userData = JSON.parse(sessionStorage.getItem('userData'))
  return userData ? userData.user.type : null
}

export function getUser() {
  const userData = JSON.parse(sessionStorage.getItem('userData'))
  console.log(userData);
  
  return userData ? userData.user: null
}
// session.js

// export function getUser() {
//   const userData = localStorage.getItem("user");
//   if (!userData) {
//       return null; // Handle no data case appropriately
//   }
//   try {
//       return JSON.parse(userData);
//   } catch (error) {
//       console.error("Failed to parse user data:", error);
//       return null; // Or handle this case based on your app's needs
//   }
// }

