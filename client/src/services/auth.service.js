export default {
  async login(email, password) {
    try {
      const response = await fetch('http://localhost:1071/api/token', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          password
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      } else {
        let json = await response.json();
        return json;
      }
    } catch(error) {
      console.log(error);
      return { error };
    }
  }
}