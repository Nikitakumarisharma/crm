import axios from "axios";
const BASE_URL = "https://crud-backend-nikita-kumaris-projects.vercel.app";

class PostService {
  // create post krne ke liye
  create(formData){
    const url =`${BASE_URL}/api/create-post`;

    const config={
      headers:{
        "content-Type":"multipart/form-data",
      },
    };
    return axios.post(url,formData,config);
  }

  // get posts krne ke liye
  getPosts(){
    const url =`${BASE_URL}/api/get-posts`;

    return axios.get(url);
  } 

  deletePosts(id){
    const url =`${BASE_URL}/api/delete-posts/`+id;

    return axios.delete(url);
  } 

  updatePost(formData) {
    const url = `${BASE_URL}/api/update-post`;
    return axios.post(url, formData);
  }
   
}
export default new PostService();
// Compare this snippet from src/components/create.jsx: