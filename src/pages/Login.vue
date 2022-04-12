<template>
  <div>
    <div class="jumbotron bg-primary text-white text-center">
      <h2 class="lead display-3">#SLACK#</h2>
      <p>Realtime communication at its best!</p>
    </div>
    <div class="container-fluid mt-5">
      <div class="row">
        <div class="col text-center">
          <button @click="loginWithGoogle" class="btn btn-outline-danger btn-lg">Login with Google</button>
        </div>
      </div>   
      <div class="row mt-5">
        <div class="col text-center">
          <button class="btn btn-outline-info btn-lg">Login with Twitter</button>
        </div>
      </div>     
    </div>
  </div>
</template>

<script>
export default {
  name: "login",
  methods: {
    loginWithGoogle() {
      firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider())
        .then((response)=>{
          console.log(response.user)
        })
    }
  }
};
</script>

<style>
  .btn, .jumbotron{
    border-radius: 0px;
  }
</style>
