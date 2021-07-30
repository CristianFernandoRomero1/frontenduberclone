<template>
  <v-layout align-center justify-center>
    <v-flex xs12 sm8 md6 lg5 xl4>
      <v-card>
        <v-toolbar dark color="blue darken-3">
          <v-toolbar-title> Viaje finalizado</v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <h1>{{ conductor }}</h1>
          <v-flex class="red--text" v-if="errorM">
            {{ errorM }}
          </v-flex>
        </v-card-text>
        <v-card-actions class="px-3 pb-3">
          <v-flex text-xs-right>
            <v-btn @click="enviarFeedback()" color="primary">Enviar</v-btn>
          </v-flex>
       </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
  <!--   </v-app>  -->
</template>

<script>
import axios from "axios";

export default {
  name: "conductorViajeFinalizado",
  props: {},
  data() {
    return {
      conductor: "Viaje finalizado",
      theUser: "",
    };
  },
  methods: {
    enviarFeedback: function () {
        var payload = { feedbackConductor: "conductor contento :D", idHistorialRuta: this.$store.state.idHistorial};
      console.log(payload);
      axios({
        url: "historialruta/conductor/feedback",
        data: payload,
        method: "POST",
      })
        .then((resp) => {
        
            console.log(resp.data);
      this.$router.push("/buscarpasajero");

          
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  mounted() {},
};
</script>

<style scoped>
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
