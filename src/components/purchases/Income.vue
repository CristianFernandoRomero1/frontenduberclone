<template>
  <v-layout align-start>
    <v-flex>
      <v-toolbar flat color="white">
        <v-toolbar-title>Ingresos</v-toolbar-title>
        <v-divider class="mx-2" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-text-field
          v-if="verNuevo == 0"
          class="text-xs-center"
          v-model="search"
          append-icon="mdi-magnify"
          label="Búsqueda"
          single-line
          hide-details
        ></v-text-field>
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          v-if="verNuevo == 0"
          @click="mostrarNuevo()"
          dark
          class="mb-2"
          >Nuevo</v-btn
        >
        <v-dialog v-model="dialog" max-width="1000px">
          <v-card>
            <v-card-title>
              <span class="headline">Seleccione un artículo</span>
            </v-card-title>
            <v-card-text>
              <v-container grid-list-md>
                <v-layout wrap>
                  <v-flex xs12 sm12 md12 lg12 xl12>
                    <v-text-field
                      v-model="texto"
                      @keyup.enter="listarArticulos()"
                      class="text-xs-center"
                      append-icon="mdi-magnify"
                      label="Búsqueda"
                    ></v-text-field>
                    <template>
                      <v-data-table
                        :headers="cabeceraArticulos"
                        :items="articulos"
                        class="elevation-1"
                      >
                        <template v-slot:[`item.seleccionar`]="{ item }">
                          <template v-if="item.estado">
                            <v-icon small @click="agregarDetalle(item)">
                              add
                            </v-icon>
                          </template>
                        </template>
                        <template v-slot:[`item.estado`]="{ item }">
                          <div v-if="item.estado">
                            <span class="blue--text">Activo</span>
                          </div>
                          <div v-else>
                            <span class="red--text">Inactivo</span>
                          </div>
                        </template>
                      </v-data-table>
                    </template>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" flat @click="close">Cancelar</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="adModal" max-width="290">
          <v-card>
            <v-card-title class="headline" v-if="adAccion == 1">
              Activar Item
            </v-card-title>
            <v-card-title class="headline" v-if="adAccion == 2">
              Desactivar Item
            </v-card-title>
            <v-card-text>
              Estás a punto de <span v-if="adAccion == 1">activar </span>
              <span v-if="adAccion == 2">desactivar </span> el item
              {{ adNombre }}
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                @click="activarDesactivarCerrar()"
                color="green darken-1"
                flat="flat"
              >
                Cancelar
              </v-btn>
              <v-btn
                v-if="adAccion == 1"
                @click="activar()"
                color="orange darken-4"
                flat="flat"
              >
                Activar
              </v-btn>
              <v-btn
                v-if="adAccion == 2"
                @click="desactivar()"
                color="orange darken-4"
                flat="flat"
              >
                Desactivar
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
      <v-data-table
        :headers="headers"
        :items="ingresos"
        :search="search"
        class="elevation-1"
        v-if="verNuevo == 0"
      >
        <template v-slot:[`item.opciones`]="{ item }">
          <v-icon small class="mr-2" @click="verIngreso(item)"> mdi-tab </v-icon>
          <template v-if="item.estado">
            <v-icon small @click="activarDesactivarMostrar(2, item)">
              mdi-block-helper
            </v-icon>
          </template>
          <template v-else>
            <v-icon small @click="activarDesactivarMostrar(1, item)">
              mdi-check
            </v-icon>
          </template>
        </template>
        <template v-slot:[`item.estado`]="{ item }">
          <div v-if="item.estado">
            <span class="blue--text">Activo</span>
          </div>
          <div v-else>
            <span class="red--text">Inactivo</span>
          </div>
        </template>
        <template v-slot:no-data>
          <v-btn color="primary" @click="listar()">Resetear</v-btn>
        </template>
      </v-data-table>
      <v-container grid-list-sm class="pa-4 white" v-if="verNuevo">
        <v-layout row wrap>
          <v-flex xs12 sm4 md4 lg4 xl4>
            <v-select
              v-model="tipocomprobante"
              :items="comprobantes"
              label="Tipo Comprobante"
            >
            </v-select>
          </v-flex>
          <v-flex xs12 sm4 md4 lg4 xl4>
            <v-text-field v-model="seriecomprobante" label="Serie Comprobante">
            </v-text-field>
          </v-flex>
          <v-flex xs12 sm4 md4 lg4 xl4>
            <v-text-field v-model="numcomprobante" label="Número Comprobante">
            </v-text-field>
          </v-flex>
          <v-flex xs12 sm8 md8 lg8 xl8>
            <v-autocomplete
              :items="personas"
              v-model="persona"
              label="Proveedor"
            >
            </v-autocomplete>
          </v-flex>
          <v-flex xs12 sm4 md4 lg4 xl4>
            <v-text-field type="number" v-model="impuesto" label="Impuesto">
            </v-text-field>
          </v-flex>
          <v-flex xs12 sm8 md8 lg8 x8>
            <v-text-field
              v-model="codigo"
              label="Código"
              @keyup.enter="buscarCodigo()"
            >
            </v-text-field>
          </v-flex>
          <v-flex xs12 sm2 md2 lg2 xl2>
            <v-btn small fab dark color="teal" @click="mostrarModalArticulos()">
              <v-icon dark>list</v-icon>
            </v-btn>
          </v-flex>
          <v-flex xs12 sm2 md2 lg2 xl2 v-show="errorArticulo">
            <div class="red--text" v-text="errorArticulo"></div>
          </v-flex>
          <v-flex xs12 sm12 md12 lg12 xl12>
            <template>
              <v-data-table
                :headers="cabeceraDetalles"
                :items="detalles"
                hide-actions
                class="elevation-1"
              >
                <template v-slot:[`item.borrar`]="{ item }">
                  <template>
                    <v-icon small @click="eliminarDetalle(detalles, item)">
                      delete
                    </v-icon>
                  </template>
                </template>
                <template v-slot:[`item.cantidad`]="{ item }">
                  <template>
                    <v-text-field
                      v-model="item.cantidad"
                      type="number"
                    ></v-text-field>
                  </template>
                </template>
                <template v-slot:[`item.subtotal`]="{ item }">
                  <template>
                    <v-text v-text="item.precio * item.cantidad"></v-text>
                  </template>
                </template>

                <template slot="no-data">
                  <h3>No hay artículos agregados al detalle.</h3>
                </template>
              </v-data-table>
              <v-flex class="text-xs-right">
                <strong>Total Parcial:</strong> $
                {{ (totalParcial = (total - totalImpuesto).toFixed(2)) }}
              </v-flex>
              <v-flex class="text-xs-right">
                <strong>Total Impuesto:</strong> $
                {{
                  (totalImpuesto = (
                    (total * impuesto) /
                    (1 + impuesto)
                  ).toFixed(2))
                }}
              </v-flex>
              <v-flex class="text-xs-right">
                <strong>Total Neto:</strong> $ {{ (total = calcularTotal) }}
              </v-flex>
            </template>
          </v-flex>
          <v-flex xs12 sm12 md12 v-show="valida">
            <div
              class="red--text"
              v-for="v in validaMensaje"
              :key="v"
              v-text="v"
            ></div>
          </v-flex>
          <v-flex xs12 sm12 md12 lg12 xl12>
            <v-btn color="blue darken-1" flat @click.native="ocultarNuevo()"
              >Cancelar</v-btn
            >
            <v-btn
              color="success"
              v-if="verDetalle == 0"
              @click.native="guardar()"
              >Guardar</v-btn
            >
          </v-flex>
        </v-layout>
      </v-container>
    </v-flex>
  </v-layout>
</template>
<script>
import axios from "axios";
export default {
  data() {
    return {
      dialog: false,
      search: "",
      ingresos: [],
      headers: [
        { text: "Opciones", value: "opciones", sortable: false },
        { text: "Usuario", value: "usuario.nombre", sortable: true },
        { text: "Proveedor", value: "persona.nombre", sortable: true },
        { text: "Tipo Comprobante", value: "tipocomprobante", sortable: true },
        {
          text: "Serie comprobante",
          value: "seriecomprobante",
          sortable: false,
        },
        {
          text: "Número comprobante",
          value: "numcomprobante",
          sortable: false,
        },
        { text: "Fecha", value: "createdAt", sortable: false },
        { text: "Impuesto", value: "impuesto", sortable: false },
        { text: "Total", value: "total", sortable: false },
        { text: "Estado", value: "estado", sortable: false },
      ],
      id: "",
      persona: "",
      personas: [],
      tipocomprobante: "",
      comprobantes: ["NOTA DEBITO", "FACTURA", "NOTA CREDITO"],
      seriecomprobante: "",
      numcomprobante: "",
      impuesto: 0.18,
      codigo: "",
      cabeceraDetalles: [
        { text: "Borrar", value: "borrar", sortable: false },
        { text: "Artículo", value: "articulo", sortable: false },
        { text: "Cantidad", value: "cantidad", sortable: false },
        { text: "Precio", value: "precio", sortable: false },
        { text: "Sub Total", value: "subtotal", sortable: false },
      ],
      detalles: [],
      verNuevo: 0,
      errorArticulo: null,
      total: 0,
      totalParcial: 0,
      totalImpuesto: 0,
      articulos: [],
      texto: "",
      cabeceraArticulos: [
        { text: "Seleccionar", value: "seleccionar", sortable: false },
        { text: "Código", value: "codigo", sortable: false },
        { text: "Nombre", value: "nombre", sortable: true },
        { text: "Categoría", value: "categoria.nombre", sortable: true },
        { text: "Stock", value: "stock", sortable: false },
        { text: "Precio Venta", value: "precioventa", sortable: false },
        { text: "Descripción", value: "descripcion", sortable: false },
        { text: "Estado", value: "estado", sortable: false },
      ],
      verDetalle: 0,
      valida: 0,
      validaMensaje: [],
      adModal: 0,
      adAccion: 0,
      adNombre: "",
      adId: "",
    };
  },
  computed: {
    calcularTotal: function () {
      let resultado = 0.0;
      for (var i = 0; i < this.detalles.length; i++) {
        resultado =
          resultado + (this.detalles[i].cantidad * this.detalles[i].precio)-this.detalles[i].descuento;
      }
      return resultado;
    },
  },
  watch: {
    dialog(val) {
      val || this.close();
    },
  },
  created() {
    this.listar();
    this.selectPersona();
  },
  methods: {
    selectPersona() {
      let me = this;
      let personaArray = [];
      let header = { headers: { "token": this.$store.state.token } };
      axios
        .get("persona/proveedores", header)
        .then(function (response) {
          console.log(response.data);
          personaArray = response.data.persona;
          personaArray.map(function (x) {
            me.personas.push({ text: x.nombre, value: x._id });
          });
          console.log("persona select")
          console.log(me.personas)
        })
        .catch(function (error) {
          console.log(error);
        });
    }, 
    buscarCodigo() {
      let me = this;
      me.errorArticulo = null;
      let header = { headers: { "token": this.$store.state.token } };
      axios
        .get(`articulo/codigo?codigo=${this.codigo}`, header)
        .then(function (response) {
          me.agregarDetalle(response.data.articulo);
        })
        .catch(function () {
          me.errorArticulo = "No existe el artículo.";
        });
    },
    agregarDetalle(data) {
      console.log(data);
      this.errorArticulo = null;
      if (this.encuentra(data._id) == true) {
        this.errorArticulo = "El artículo ya ha sido agregado.";
      } else {
        this.detalles.push({
          _id: data._id,
          articulo: data.nombre,
          cantidad: 1,
          precio: data.precioventa,
          descuento:0
        });
        this.codigo = "";
      }
    },
    encuentra(id) {
      let sw = 0;
      for (var i = 0; i < this.detalles.length; i++) {
        if (this.detalles[i]._id == id) {
          sw = true;
        }
      }
      return sw;
    },
    eliminarDetalle(arr, item) {
      console.log(arr, "   /   ", item);
      let i = arr.indexOf(item);
      if (i != -1) {
        arr.splice(i, 1);
      }
    },
    listarArticulos() {
      let me = this;
      let header = { headers: { "token": this.$store.state.token } };
      axios
        .get(`articulo?query=${this.texto}`, header)
        .then(function (response) {
          console.log(response.data);
          me.articulos = response.data.articulos;
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    mostrarModalArticulos() {
      this.dialog = 1;
    },
    listarDetalles(id) {
      let me = this;
      let header = { headers: { "token": this.$store.state.token } };
      axios
        .get(`ingreso/${id}`, header)
        .then(function (response) {
          me.detalles = response.data.ingreso.detalles;
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    verIngreso(item) {
      this.limpiar();
      this.tipocomprobante = item.tipocomprobante;
      this.seriecomprobante = item.seriecomprobante;
      this.numcomprobante = item.numcomprobante;
      this.persona = item.persona._id;
      this.impuesto = item.impuesto;
      this.listarDetalles(item._id);
      this.verNuevo = 1;
      this.verDetalle = 1;
    },
    listar() {
      let me = this;
      let header = { headers: { "token": this.$store.state.token } };
      axios
        .get("ingreso", header)
        .then(function (response) {
          me.ingresos = response.data.ingreso;
          console.log(response.data.ingreso)
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    limpiar() {
      this.id = "";
      this.tipocomprobante = "";
      this.seriecomprobante = "";
      this.numcomprobante = "";
      this.impuesto = 0.18;
      this.codigo = "";
      this.total = 0;
      this.totalParcial = 0;
      this.totalImpuesto = 0;
      this.detalles = [];
      this.verNuevo = 0;
      this.valida = 0;
      this.validaMensaje = [];
      this.verDetalle = 0;
    },
    validar() {
      this.valida = 0;
      this.validaMensaje = [];
      if (!this.persona) {
        this.validaMensaje.push("Seleccione un proveedor.");
      }
      if (!this.tipocomprobante) {
        this.validaMensaje.push("Seleccione un tipo de comprobante.");
      }
      if (!this.numcomprobante) {
        this.validaMensaje.push("Ingrese el número del comprobante.");
      }
      if (!this.impuesto || this.impuesto < 0 || this.impuesto > 1) {
        this.validaMensaje.push("Ingrese un impuesto válido.");
      }
      if (this.detalles.length <= 0) {
        this.validaMensaje.push("Ingrese al menos un artículo al detalle");
      }
      if (this.validaMensaje.length) {
        this.valida = 1;
      }
      return this.valida;
    },
    mostrarNuevo() {
      this.verNuevo = 1;
    },
    ocultarNuevo() {
      this.verNuevo = 0;
      this.limpiar();
    },
    guardar() {
      let me = this;
      let header = { headers: { "token": this.$store.state.token } };
      if (this.validar()) {
        return;
      }
      //Código para guardar
      axios
        .post(
          "ingreso",
          {
            persona: this.persona,
            usuario: this.$store.state.usuario._id,
            tipocomprobante: this.tipocomprobante,
            seriecomprobante: this.seriecomprobante,
            numcomprobante: this.numcomprobante,
            impuesto: this.impuesto,
            total: this.total,
            detalles: this.detalles,
          },
          header
        )
        .then(function () {
          me.limpiar();
          me.close();
          me.listar();
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    activarDesactivarMostrar(accion, item) {
      this.adModal = 1;
      this.adNombre = item.numcomprobante;
      this.adId = item._id;
      if (accion == 1) {
        this.adAccion = 1;
      } else if (accion == 2) {
        this.adAccion = 2;
      } else {
        this.adModal = 0;
      }
    },
    activarDesactivarCerrar() {
      this.adModal = 0;
    },
    activar() {
      let me = this;
      let header = { headers: { "token": this.$store.state.token } };
      axios
        .put(`ingreso/activate/${this.adId}`, {}, header)
        .then(function () {
          me.adModal = 0;
          me.adAccion = 0;
          me.adNombre = "";
          me.adId = "";
          me.listar();
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    desactivar() {
      let me = this;
      let header = { headers: { "token": this.$store.state.token } };
      axios
        .put(`ingreso/deactivate/${this.adId}`, {}, header)
        .then(function () {
          me.adModal = 0;
          me.adAccion = 0;
          me.adNombre = "";
          me.adId = "";
          me.listar();
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    close() {
      this.dialog = false;
    },
  },
};
</script>
