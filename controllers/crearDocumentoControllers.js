const sql = require("mssql");
const logger = require("../config/logger.js");
const {
  connectToDatabase,
  closeDatabaseConnection,
} = require("../config/database.js");
const moment = require("moment");

/**
 * Prepara los datos para insertar en la tabla pedidosDet.
 * @param {Object} req - El objeto de solicitud HTTP.
 * @param {Object} res - El objeto de respuesta HTTP.
 */
async function crearDocumento(req, res) {
  logger.info(`Iniciamos la funcion creaDocumento nota de venta interna ${req.body}`);

  const oredenPedido = req.body;
  let result;
  try {
    // Conecta a la base de datos
    await connectToDatabase("BdQMakita");

    const {
      pedido: Correlativo,
      tipoDocumento: TipoDocumento,
      codigo_posto,
    } = oredenPedido;

    let rutfor = codigo_posto.trim();

   // Solo agrega el guion si `codigo_posto` no tiene uno
          const RutCliente = rutfor.trim().includes('-') 
          ? rutfor 
          : `${rutfor.slice(0, -1)}-${rutfor.slice(-1)}`;

console.log("log ru formateado",{
Correlativo,
TipoDocumento,
RutCliente,
});
    const request = new sql.Request();
    // Ejecuta el procedimiento almacenado con los parámetros
    result = await request.query`
        EXEC Crea_NotaVenta_GE_Copia 
        @Empresa = 'Makita', 
        @TipoDocumento = ${TipoDocumento.trim()}, 
        @Correlativo = ${Correlativo}, 
        @RutCliente = ${RutCliente}`;

    // Cierra la conexión a la base de datos
    await closeDatabaseConnection();

    logger.info(`Fin de la funcion creaDocumento ${JSON.stringify(result)}`);
    result.mensaje = "Proceso exitoso , se creda nota venta interna";
    res.status(200).json(result);
  } catch (error) {
    // Manejamos cualquier error ocurrido durante el proceso
    logger.error(
      `Error en crear documento nota venta interna: ${error.message}`
    );
    res
      .status(500)
      .json({
        error: `Error en el servidor [crear-documento-nvi-ms] :  ${error.message}`,
      });
  }
}

module.exports = {
  crearDocumento,
};
