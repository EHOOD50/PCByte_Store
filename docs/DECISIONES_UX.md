# DECISIONES UX - PCByte Store

> Documento de referencia para todas las decisiones de experiencia de usuario, diseño y flujo de navegación.
>
> Estas decisiones se consideran parte de la identidad del proyecto y no deben modificarse sin una decisión consciente.

---

# FILOSOFÍA DEL PROYECTO

PCByte no busca obligar al cliente a comprar.

PCByte busca generar confianza.

La experiencia debe sentirse cercana, profesional y transparente.

Queremos que el cliente vuelva porque tuvo una buena experiencia, no porque fue forzado.

---

# PRINCIPIOS

## 1. Nunca obligar al registro.

El usuario siempre podrá comprar como invitado.

No existirán bloqueos artificiales para obligarlo a crear una cuenta.

---

## 2. La Cuenta PCByte mejora la experiencia.

La cuenta NO existe para permitir comprar.

La cuenta existe para mantener organizada la relación del cliente con PCByte antes, durante y después de la compra.

---

## 3. Nunca castigar al invitado.

Comprar como invitado NO debe sentirse una experiencia inferior.

No deben utilizarse mensajes como:

- Compra rápida
- Compra express
- Compra mejor
- Más beneficios

El usuario invitado debe sentir que es completamente bienvenido.

---

## 4. El diseño debe insinuar la mejor opción.

La Cuenta PCByte tendrá una presentación visual ligeramente más destacada.

Pero nunca se utilizarán mensajes agresivos para convencer al usuario.

Debe ser el diseño quien transmita la propuesta de valor.

---

## 5. La confianza es más importante que vender.

Evitar frases como:

- Solo hoy
- Últimas unidades
- Aprovecha
- Compra ahora

El tono debe ser profesional.

---

# CHECKOUT SELECTION

El usuario siempre tendrá dos caminos.

## Invitado

Debe ser simple.

No debe contener una lista de beneficios.

Su objetivo es únicamente permitir continuar la compra.

Texto orientativo:

"Si prefieres no crear una cuenta en este momento, puedes continuar con tu compra."

Nada más.

---

## Cuenta PCByte

Aquí sí se comunica el valor de la cuenta.

Se pueden mostrar:

- Historial de compras.
- Direcciones guardadas.
- Seguimiento de pedidos.
- Garantías.
- Información organizada.
- Mejor experiencia en futuras compras.

Nunca utilizar descuentos como argumento.

---

# FLUJO DE COMPRA

Usuario entra

↓

¿Está autenticado?

NO

↓

CheckoutSelection

↓

Invitado
o
Cuenta PCByte

↓

Checkout

---

SI

↓

Ir directamente al Checkout.

Nunca volver a mostrar CheckoutSelection.

---

# REGISTRO

Formulario dividido en dos bloques.

## Datos personales

- Nombre
- Apellidos
- Correo
- Teléfono
- Contraseña

---

## Dirección predeterminada

La primera dirección del usuario.

Podrá modificarla posteriormente.

Campos:

- Calle
- Número
- Tipo de complemento
- Detalle complemento
- Región
- Comuna
- Referencias

---

Región y Comuna utilizan listas dependientes.

---

Tipo de complemento y detalle deben aparecer agrupados visualmente.

---

La primera dirección creada será la Dirección predeterminada.

---

# VALIDACIÓN DE CORREO

Después del registro:

Estado:

PENDIENTE_VERIFICACION

Se enviará un correo con enlace de activación.

Mientras no valide:

- No podrá iniciar sesión.

---

Después de 48 horas sin validar:

La cuenta será eliminada automáticamente.

El usuario podrá registrarse nuevamente o comprar como invitado.

---

# IDENTIDAD VISUAL

Colores principales:

Negro:

#08101D

Azul:

#0066FF

Verde:

#97CF00

---

El diseño debe ser:

- limpio
- elegante
- moderno
- con mucho espacio
- sin sobrecargar

---

# HOME

No utiliza Navbar.

Debe transmitir confianza antes que vender.

---

# LOGIN

Pantalla propia.

No reutiliza la Navbar del catálogo.

---

# REGISTRO

Pantalla propia.

No reutiliza la Navbar del catálogo.

---

# CHECKOUT

Pantalla propia.

No reutiliza la Navbar del catálogo.

---

# PRINCIPIO GENERAL

Siempre que exista una duda de UX, diseño o flujo, debe prevalecer este documento por sobre soluciones improvisadas.