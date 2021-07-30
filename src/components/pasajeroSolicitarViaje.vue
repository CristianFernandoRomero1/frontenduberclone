<template>
  <v-layout align-center justify-center>
    <v-flex xs12 sm8 md6 lg5 xl4>
      <v-card>
        <v-toolbar dark color="blue darken-3">
          <v-toolbar-title> Solicitar viaje </v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <v-text-field
            v-model="lugarOrigen"
            autofocus
            color="accent"
            label="Lugar origen"
            required
          >
          </v-text-field>
          <v-text-field
            v-model="lugarDestino"
            type="text"
            color="accent"
            label="Lugar destino"
            required
          >
          </v-text-field>
          <v-text-field
            v-model="dineroPagado"
            type="text"
            color="accent"
            label="Dinero pagado"
            required
          >
          </v-text-field>
          <v-flex class="red--text" v-if="errorM">
            {{ errorM }}
          </v-flex>
        </v-card-text>
        <v-card-actions class="px-3 pb-3">
          <v-flex text-xs-right>
            <v-btn @click="solicitar()" color="primary">Solicitar</v-btn>
          </v-flex>
          <v-flex text-xs-right>
            <v-btn @click="soyConductor()" color="primary">Soy conductor</v-btn>
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
  name: "pasajeroSolicitarViaje",
  props: {},
  data() {
    return {
      lugarOrigen: "",
      lugarDestino: "",
      dineroPagado: "",
      theUser: "",
    };
  },
  methods: {
    solicitar: function () {
      ///
      var payload = {
        lugarOrigen: this.lugarOrigen,
        lugarDestino: this.lugarDestino,
        dineroPagado: this.dineroPagado,
        idPasajero: this.$store.state.theUser,
      };
      axios({
        url: "historialruta/nuevaruta",
        data: payload,
        method: "POST",
      })
        .then((resp) => {
          if (resp.status === 200) {
            console.log(resp.data);
            this.$store.dispatch("guardarIdHistorial", resp.data.historial._id);
            console.log("imprimiendo id historial");
            console.log(this.$store.state.idHistorial);
            this.$router.push("/buscarconductor");
          }
        })
        .catch((err) => {
          console.log(err);
        });

      ///
    },
    soyConductor : function(){
      this.$router.push("/buscarpasajero");
    }
  },
  mounted() {},
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
