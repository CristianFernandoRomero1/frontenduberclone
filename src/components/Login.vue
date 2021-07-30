<template>

 <v-layout align-center justify-center>
        <v-flex xs12 sm8 md6 lg5 xl4>
            <v-card>
                <v-toolbar dark color="blue darken-3">
                    <v-toolbar-title>
                        Acceso al Sistema
                    </v-toolbar-title>
                </v-toolbar>
                <v-card-text>
                    <v-text-field v-model="email" autofocus color="accent" label="Email" required>
                    </v-text-field>
                    <v-text-field v-model="password" type="password" color="accent" label="Password" required>
                    </v-text-field>
                    <v-flex class="red--text" v-if="errorM">
                        {{errorM}}
                    </v-flex>
                </v-card-text>
                <v-card-actions class="px-3 pb-3">
                    <v-flex text-xs-right>
                        <v-btn @click="login()" color="primary">Ingresar</v-btn>
                    </v-flex>
                </v-card-actions>
            </v-card>
        </v-flex>
    </v-layout>
<!--   </v-app>  -->
</template>

<script>
import axios from "axios"

export default {
  name: "Login",
  props: {},
  data() {
    return {
      email: "",
      password: "",
    };
  },
  methods: {
    login: function () {
      ///
      var payload = { correo: this.email, contrasena: this.password };
      axios({
        url: "usuarioaplicacion/login", //http://localhost:5000/api/
        data: payload,
        method: "POST",
      })
        .then((resp) => {
          if (resp.status === 200) {
            var token = resp.data.token;
            //this.$store.dispatch("setToken", resp.data.token)
            this.$store.dispatch("guardarToken",resp.data);
          
            localStorage.setItem("user-token", token); // store the token in localstorage
            console.log(this.$store.state.token)
            console.log(this.$store.state.theUser);
            this.$router.push("/pasajerosolicitarviaje");
            // console.log(this.$router.currentRoute.fullPath);
          }
        })
        .catch((err) => {
          console.log(err);
          localStorage.removeItem("user-token"); // if the request fails, remove any possible user token if possible
        });

      ///
    },
  },
  mounted() {
    this.$nextTick(function () {
      // Code that will run only after the
      // entire view has been rendered
      //var mytoken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiI2MDgwZGNmYWNjODAyOTIzZTQ2N2E1NzMiLCJpYXQiOjE2MTk5MDM3MTksImV4cCI6MTYyMDUwODUxOX0.xULcqEM31DJKFKwT8j3kARJtNA2L3e86UNx7VfuMgD0"; 
      var mytoken = localStorage.getItem("user-token")
      axios({
        url: "usuario/token",
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          token: mytoken, //the token is a variable which holds the token
          frontend: 1
        },
      })
        .then((resp) => {
          if (resp.status === 200) {
            this.$router.push("/homepage");
            
          }
        })
        .catch((err) => {
          console.log(err);
          localStorage.removeItem("user-token"); // if the request fails, remove any possible user token if possible
        });
    });
  },
};
</script>

<style scoped>
/* #login {
  left: 50%;
  top: 40%;
  position: absolute;
  transform: translate(-50%, -50%);
  display: inline-block;
  text-align: center;
} */

h3 {
  margin: 0px 0 0;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
