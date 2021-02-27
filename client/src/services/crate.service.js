export default {
  async listCrates(token) {
    try {
      const response = await fetch('http://localhost:1071/api/crate', {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,          
        },
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