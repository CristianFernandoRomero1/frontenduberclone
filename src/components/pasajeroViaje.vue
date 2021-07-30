<template>
  <v-layout align-center justify-center>
    <v-flex xs12 sm8 md6 lg5 xl4>
      <v-card>
        <v-toolbar dark color="blue darken-3">
          <v-toolbar-title> Solicitar viaje </v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <h1>{{ conductor }}</h1>
          <v-flex class="red--text" v-if="errorM">
            {{ errorM }}
          </v-flex>
        </v-card-text>
        <v-card-actions class="px-3 pb-3">
          <v-flex text-xs-right>
            <v-btn @click="refrescar()" color="primary">Refrescar</v-btn>
          </v-flex>
          <v-flex text-xs-right>
            <v-btn @click="cancelarViaje()" color="primary"
              >Cancelar viaje</v-btn
            >
          </v-flex>
          <v-flex text-xs-right>
            <v-btn @click="viajeFinalizado()" color="primary"
              >Viaje finalizado</v-btn
            >
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
  name: "pasajeroViaje",
  props: {},
  data() {
    return {
      conductor: "Esperando conductor...",
      theUser: "",
    };
  },
  methods: {
    refrescar: function () {
      //console.log(this.$store.state.theUser);
      //var payload = { idPasajero: this.$store.state.theUser};
      axios({
        url: "historialruta/buscarconductor/" + this.$store.state.idHistorial,
        method: "POST",
      })
        .then((resp) => {
          if (resp.status === 200) {
            console.log(resp.data);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    viajeFinalizado: function () {
      this.$router.push("pasajero/viajefinalizado");
    },
    cancelarViaje: function () {
      this.$router.push("pasajero/viajecancelado");
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
