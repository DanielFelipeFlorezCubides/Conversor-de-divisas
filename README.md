# Conversor de Divisas - Aplicación de Consola Mejorada

Una aplicación de consola interactiva y visualmente atractiva para convertir entre diferentes monedas usando tasas de cambio en tiempo real.

## ✨ Características

- 🌍 Conversión entre múltiples monedas internacionales
- 📊 Tasas de cambio en tiempo real
- 🎨 Interfaz colorida y atractiva con arte ASCII
- 💻 Menús interactivos fáciles de navegar
- ⚡ Conversión rápida entre pares populares
- 📋 Tablas formateadas para mostrar resultados
- 🔄 Spinners de carga animados
- ✅ Validación robusta de entrada de datos

## 🚀 Nuevas Características Visuales

- **Arte ASCII**: Título llamativo con figlet
- **Colores**: Interfaz colorida con chalk y gradientes
- **Cajas decorativas**: Resultados destacados con boxen
- **Tablas**: Datos organizados con cli-table3
- **Menús interactivos**: Navegación intuitiva con inquirer
- **Spinners**: Indicadores de carga con ora

## 📦 Dependencias

### Funcionalidad Principal
- `currency-converter-lt`: Conversión de monedas con tasas en tiempo real

### Interfaz Mejorada
- `inquirer`: Menús interactivos y prompts
- `chalk`: Colores en terminal
- `figlet`: Arte ASCII para texto
- `boxen`: Cajas decorativas
- `ora`: Spinners de carga
- `cli-table3`: Tablas formateadas
- `gradient-string`: Gradientes de color

## Instalación

1. Asegúrate de tener Node.js instalado
2. Instala las dependencias:

```bash
npm install
```

## Uso

```bash
npm start
```

O directamente:

```bash
node index.js
```

## 🎯 Funcionalidades

### 1. 💱 Convertir Moneda
- Selección de monedas desde menú o ingreso manual
- Validación de entrada
- Resultados en tabla formateada

### 2. 📋 Ver Monedas Disponibles
- Lista completa de monedas soportadas
- Tabla organizada con códigos y nombres

### 3. 📊 Conversión Rápida
- Pares de monedas populares predefinidos
- Conversión instantánea
- Ideal para consultas frecuentes

### 4. 🚪 Salir
- Cierre elegante de la aplicación

## 🎨 Capturas de Pantalla

La aplicación ahora incluye:
- Título en arte ASCII colorido
- Menús con iconos y colores
- Tablas organizadas para resultados
- Cajas decorativas para información importante
- Spinners animados durante las conversiones

## 🌍 Monedas Soportadas

Incluye todas las monedas principales como USD, EUR, GBP, JPY, CAD, AUD, MXN, BRL, ARS, COP, y muchas más.

## Ejemplo de Uso

```
=== CONVERSOR DE DIVISAS ===
1. Convertir moneda
2. Ver monedas disponibles
3. Salir
============================
Selecciona una opción (1-3): 1

Ingresa la moneda de origen (ej: USD): USD
Ingresa la moneda de destino (ej: EUR): EUR
Ingresa la cantidad a convertir: 100

🔄 Realizando conversión...

✅ RESULTADO DE LA CONVERSIÓN
================================
💰 100 USD = 92.50 EUR
================================
📊 Tasa de cambio: 1 USD = 0.9250 EUR
```

## Notas

- La aplicación requiere conexión a internet para obtener las tasas de cambio actuales
- Los códigos de moneda deben ingresarse en formato ISO 4217 (ej: USD, EUR, GBP)
- Las tasas de cambio se actualizan automáticamente con cada conversión
