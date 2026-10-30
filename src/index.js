export default {
  async fetch(request, env) {
    // static assets are served automatically for matching paths;
    // this runs only for non-asset requests
    return new Response("OK");
  },
};
