import inquirer from "inquirer"
import chalk from "chalk"
import figlet from "figlet"
import boxen from "boxen"
import ora from "ora"
import Table from "cli-table3"
import gradient from "gradient-string"

const API_KEY = "a9b740e21602ecb26b8b4082"
const API_BASE_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/`

// Configuración de colores y estilos
const colors = {
  primary: chalk.cyan,
  success: chalk.green,
  error: chalk.red,
  warning: chalk.yellow,
  info: chalk.blue,
  accent: chalk.magenta,
}

// Lista de monedas populares con sus nombres completos
const popularCurrencies = [
  { name: "USD - Dólar estadounidense", value: "USD" },
  { name: "EUR - Euro", value: "EUR" },
  { name: "GBP - Libra esterlina", value: "GBP" },
  { name: "JPY - Yen japonés", value: "JPY" },
  { name: "CAD - Dólar canadiense", value: "CAD" },
  { name: "AUD - Dólar australiano", value: "AUD" },
  { name: "CHF - Franco suizo", value: "CHF" },
  { name: "CNY - Yuan chino", value: "CNY" },
  { name: "MXN - Peso mexicano", value: "MXN" },
  { name: "BRL - Real brasileño", value: "BRL" },
  { name: "ARS - Peso argentino", value: "ARS" },
  { name: "COP - Peso colombiano", value: "COP" },
  { name: "CLP - Peso chileno", value: "CLP" },
  { name: "PEN - Sol peruano", value: "PEN" },
  { name: "Ingresar código manualmente", value: "CUSTOM" },
]

// Función para mostrar el título con arte ASCII
function showTitle() {
  console.clear()

  const title = figlet.textSync("Currency", {
    font: "Big",
    horizontalLayout: "default",
    verticalLayout: "default",
  })

  const subtitle = figlet.textSync("Converter", {
    font: "Big",
    horizontalLayout: "default",
    verticalLayout: "default",
  })

  console.log(gradient.rainbow(title))
  console.log(gradient.rainbow(subtitle))
  console.log()

  const welcomeBox = boxen(
    colors.primary("¡Bienvenido al Conversor de Divisas!\n") +
      colors.info("Convierte entre diferentes monedas con tasas en tiempo real"),
    {
      padding: 1,
      margin: 1,
      borderStyle: "round",
      borderColor: "cyan",
      backgroundColor: "#1a1a1a",
    },
  )

  console.log(welcomeBox)
}

// Función para mostrar el menú principal
async function showMainMenu() {
  const choices = [
    {
      name: "💱 Convertir moneda",
      value: "convert",
    },
    {
      name: "📋 Ver monedas disponibles",
      value: "currencies",
    },
    {
      name: "📊 Conversión rápida (monedas populares)",
      value: "quick",
    },
    {
      name: "🚪 Salir",
      value: "exit",
    },
  ]

  const answer = await inquirer.prompt([
    {
      type: "list",
      name: "action",
      message: colors.accent("¿Qué deseas hacer?"),
      choices: choices,
      pageSize: 10,
    },
  ])

  return answer.action
}

// Función para seleccionar moneda
async function selectCurrency(message) {
  const answer = await inquirer.prompt([
    {
      type: "list",
      name: "currency",
      message: colors.primary(message),
      choices: popularCurrencies,
      pageSize: 15,
    },
  ])

  if (answer.currency === "CUSTOM") {
    const customAnswer = await inquirer.prompt([
      {
        type: "input",
        name: "customCurrency",
        message: colors.warning("Ingresa el código de la moneda (ej: USD, EUR):"),
        validate: (input) => {
          if (input.length !== 3) {
            return "El código debe tener exactamente 3 caracteres"
          }
          return true
        },
        filter: (input) => input.toUpperCase(),
      },
    ])
    return customAnswer.customCurrency
  }

  return answer.currency
}

// Función para obtener tasas de cambio de la API
async function getExchangeRate(fromCurrency, toCurrency) {
  try {
    const response = await fetch(`${API_BASE_URL}${fromCurrency}`)
    const data = await response.json()

    if (data.result === "error") {
      throw new Error(data["error-type"] || "Error desconocido al obtener tasas de cambio.")
    }

    const rate = data.conversion_rates[toCurrency]
    if (!rate) {
      throw new Error(`No se encontró la tasa de cambio para ${toCurrency}.`)
    }
    return rate
  } catch (error) {
    throw new Error(`No se pudieron obtener las tasas de cambio: ${error.message}`)
  }
}

// Función para realizar conversión
async function performConversion() {
  try {
    console.log(colors.info("\n=== CONVERSIÓN DE MONEDA ===\n"))

    // Seleccionar moneda de origen
    const fromCurrency = await selectCurrency("Selecciona la moneda de origen:")

    // Seleccionar moneda de destino
    const toCurrency = await selectCurrency("Selecciona la moneda de destino:")

    // Solicitar cantidad
    const amountAnswer = await inquirer.prompt([
      {
        type: "number",
        name: "amount",
        message: colors.primary("Ingresa la cantidad a convertir:"),
        validate: (input) => {
          if (isNaN(input) || input <= 0) {
            return "Por favor ingresa un número válido mayor a 0"
          }
          return true
        },
      },
    ])

    // Mostrar spinner mientras se realiza la conversión
    const spinner = ora({
      text: colors.info("Obteniendo tasas de cambio..."),
      spinner: "dots12",
    }).start()

    const rate = await getExchangeRate(fromCurrency, toCurrency)
    const result = amountAnswer.amount * rate

    spinner.succeed(colors.success("¡Conversión completada!"))

    // Mostrar resultado en una tabla bonita
    const table = new Table({
      head: [colors.accent("Concepto"), colors.accent("Valor")],
      colWidths: [25, 20],
      style: {
        head: [],
        border: ["cyan"],
      },
    })

    table.push(
      ["Cantidad original", colors.warning(`${amountAnswer.amount} ${fromCurrency}`)],
      ["Resultado", colors.success(`${result.toFixed(2)} ${toCurrency}`)],
      ["Tasa de cambio", colors.info(`1 ${fromCurrency} = ${rate.toFixed(4)} ${toCurrency}`)],
    )

    console.log("\n" + table.toString())

    // Mostrar resultado destacado
    const resultBox = boxen(
      colors.success(`💰 ${amountAnswer.amount} ${fromCurrency} = ${result.toFixed(2)} ${toCurrency}`),
      {
        padding: 1,
        margin: 1,
        borderStyle: "double",
        borderColor: "green",
      },
    )

    console.log(resultBox)
  } catch (error) {
    console.log(colors.error("\n❌ Error en la conversión:"), error.message)
    console.log(colors.warning("💡 Asegúrate de tener una clave API válida y conexión a internet."))
  }
}

// Función para mostrar monedas disponibles
function showAvailableCurrencies() {
  console.log(colors.info("\n=== MONEDAS DISPONIBLES ===\n"))

  const table = new Table({
    head: [colors.accent("Código"), colors.accent("Moneda")],
    colWidths: [10, 30],
    style: {
      head: [],
      border: ["cyan"],
    },
  })

  const currencies = [
    ["USD", "Dólar estadounidense"],
    ["EUR", "Euro"],
    ["GBP", "Libra esterlina"],
    ["JPY", "Yen japonés"],
    ["CAD", "Dólar canadiense"],
    ["AUD", "Dólar australiano"],
    ["CHF", "Franco suizo"],
    ["CNY", "Yuan chino"],
    ["MXN", "Peso mexicano"],
    ["BRL", "Real brasileño"],
    ["ARS", "Peso argentino"],
    ["COP", "Peso colombiano"],
    ["CLP", "Peso chileno"],
    ["PEN", "Sol peruano"],
  ]

  currencies.forEach(([code, name]) => {
    table.push([colors.warning(code), colors.primary(name)])
  })

  console.log(table.toString())

  const infoBox = boxen(
    colors.info("💡 Estas son solo algunas de las monedas disponibles.\n") +
      colors.primary("La API soporta muchas más monedas internacionales."),
    {
      padding: 1,
      margin: 1,
      borderStyle: "round",
      borderColor: "blue",
    },
  )

  console.log(infoBox)
}

// Función para conversión rápida
async function quickConversion() {
  // Definimos los pares de monedas con sus propiedades 'from' y 'to'
  const quickPairs = [
    { name: "USD → EUR", from: "USD", to: "EUR" },
    { name: "EUR → USD", from: "EUR", to: "USD" },
    { name: "USD → MXN", from: "USD", to: "MXN" },
    { name: "EUR → GBP", from: "EUR", to: "GBP" },
    { name: "USD → JPY", from: "USD", to: "JPY" },
    { name: "Personalizada", value: "custom" }, // Opción para ir a la conversión manual
  ]

  const pairAnswer = await inquirer.prompt([
    {
      type: "list",
      name: "selectedPairName", // Capturamos el nombre del par seleccionado
      message: colors.primary("Selecciona un par de conversión:"),
      choices: quickPairs.map((pair) => pair.name), // Mostramos solo los nombres en las opciones
    },
  ])

  // Si el usuario selecciona "Personalizada", redirigimos a la conversión manual
  if (pairAnswer.selectedPairName === "Personalizada") {
    await performConversion()
    return
  }

  // Encontramos el objeto del par completo basado en el nombre seleccionado
  const selectedPair = quickPairs.find((pair) => pair.name === pairAnswer.selectedPairName)

  if (!selectedPair) {
    console.log(colors.error("❌ Error: Par de conversión no encontrado."))
    return
  }

  const amountAnswer = await inquirer.prompt([
    {
      type: "number",
      name: "amount",
      message: colors.primary(`Cantidad en ${selectedPair.from}:`), // Usamos selectedPair.from
      validate: (input) => {
        if (isNaN(input) || input <= 0) {
          return "Por favor ingresa un número válido mayor a 0"
        }
        return true
      },
    },
  ])

  const spinner = ora({
    text: colors.info("Convirtiendo..."),
    spinner: "arrow3",
  }).start()

  try {
    const rate = await getExchangeRate(selectedPair.from, selectedPair.to) // Usamos selectedPair.from y selectedPair.to
    const result = amountAnswer.amount * rate

    spinner.succeed(colors.success("¡Listo!"))

    const quickResultBox = boxen(
      colors.success(`🚀 ${amountAnswer.amount} ${selectedPair.from} = ${result.toFixed(2)} ${selectedPair.to}`),
      {
        padding: 1,
        margin: 1,
        borderStyle: "bold",
        borderColor: "green",
      },
    )

    console.log(quickResultBox)
  } catch (error) {
    spinner.fail(colors.error("Error en la conversión"))
    console.log(colors.error("❌ Error en conversión rápida:"), error.message)
  }
}

// Función para pausar y esperar input del usuario
async function waitForContinue() {
  await inquirer.prompt([
    {
      type: "input",
      name: "continue",
      message: colors.primary("Presiona Enter para continuar..."),
    },
  ])
}

// Función principal
async function main() {
  showTitle()

  while (true) {
    try {
      const action = await showMainMenu()

      switch (action) {
        case "convert":
          await performConversion()
          await waitForContinue()
          break

        case "currencies":
          showAvailableCurrencies()
          await waitForContinue()
          break

        case "quick":
          await quickConversion()
          await waitForContinue()
          break

        case "exit":
          const exitBox = boxen(colors.success("¡Gracias por usar el Conversor de Divisas! 👋"), {
            padding: 1,
            margin: 1,
            borderStyle: "round",
            borderColor: "green",
          })
          console.log(exitBox)
          process.exit(0)

        default:
          console.log(colors.error("Opción no válida"))
      }

      // Limpiar pantalla antes del siguiente ciclo
      console.clear()
      showTitle()
    } catch (error) {
      if (error.name === "ExitPromptError") {
        console.log(colors.warning("\n👋 ¡Hasta luego!"))
        process.exit(0)
      }
      console.log(colors.error("Error inesperado:"), error.message)
    }
  }
}

// Manejar Ctrl+C
process.on("SIGINT", () => {
  console.log(colors.warning("\n\n👋 ¡Hasta luego!"))
  process.exit(0)
})

// Iniciar la aplicación
main().catch((error) => {
  console.log(colors.error("Error al iniciar:"), error.message)
  process.exit(1)
})