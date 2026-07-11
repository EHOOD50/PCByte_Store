# ESTADO DEL PROYECTO PCBYTE

**Versión del documento:** 1.0

**Última actualización:** Julio 2026

---

# 1. Visión General

## Nombre

PCByte Store

---

## Objetivo

PCByte es una plataforma de comercio electrónico especializada en la venta de productos tecnológicos y servicios técnicos.

El proyecto nace con el objetivo de evolucionar desde un negocio local administrado mediante WhatsApp y Facebook hacia una plataforma profesional, escalable y completamente administrable.

No es un proyecto académico.

Está siendo construido como una aplicación preparada para producción.

---

# Objetivos funcionales

La plataforma permitirá administrar:

- Productos
- Categorías
- Marcas
- Pedidos
- Pagos
- Clientes
- Servicios técnicos
- Configuración general

---

# Filosofía del proyecto

Durante el desarrollo se definieron algunos principios que deben mantenerse.

## Calidad antes que velocidad

Se prioriza:

- arquitectura limpia
- código mantenible
- separación de responsabilidades

por sobre implementar funcionalidades rápidamente.

---

## Un Sprint = Un Commit

Cada módulo terminado genera un commit independiente.

Ejemplo:

```
feat(brand): integra marcas con productos en el backend
```

Esto permite mantener un historial limpio y facilita volver atrás cuando sea necesario.

---

## Responsabilidad única

Cada componente debe tener una única responsabilidad.

Ejemplos:

Backend

- Controller
- Service
- Repository

Frontend

- Manager
- Toolbar
- Table
- Modal

---

# Stack Tecnológico

## Backend

- Java 21 LTS
- Spring Boot 3
- Spring Data JPA
- Spring Security
- Flyway
- PostgreSQL
- Maven

---

## Frontend

- React 19
- TypeScript
- Vite
- TailwindCSS
- Axios
- Lucide React

---

## Control de versiones

Git

Repositorio:

PCByte_Store

Arquitectura:

Monorepo

---

# Arquitectura General

```
PCByte_Store

│

├── PCByte_Back

│       Spring Boot

│

├── PCByte_Front

│       React

│

└── docs

        documentación
```

---

Cada módulo del sistema mantiene responsabilidades claramente separadas.

Backend

```
Controller

↓

Service

↓

Repository

↓

Entity
```

Frontend

```
Manager

↓

Componentes

↓

API

↓

Backend
```

---

# Organización del Monorepo

```
PCByte_Store

├── PCByte_Back

├── PCByte_Front

└── docs
```

## PCByte_Back

Contiene:

- API REST
- lógica de negocio
- acceso a datos
- migraciones Flyway
- seguridad
- Mercado Pago

---

## PCByte_Front

Contiene:

- tienda
- panel administrativo
- catálogo
- carrito
- checkout
- autenticación

---

## docs

Documentación técnica.

Este documento pertenece a esta carpeta.

---

# Estado General del Backend

Actualmente el backend se encuentra completamente operativo.

Compila correctamente.

Swagger funciona correctamente.

Las pruebas básicas de API fueron realizadas con éxito.

---

# Arquitectura Backend

Se adoptó una arquitectura clásica por capas.

```
Controller

↓

Service

↓

Repository

↓

Entity
```

Cada capa posee una responsabilidad específica.

---

# Base de Datos

Motor:

PostgreSQL

Migraciones:

Flyway

Todas las modificaciones estructurales se realizan mediante migraciones.

No se modifican tablas manualmente.

---

# Módulos implementados

Actualmente existen los siguientes módulos.

## Productos

Estado

✅ Implementado

Incluye:

- CRUD
- filtros
- búsqueda
- paginación
- actualización parcial
- stock

---

## Categorías

Estado

✅ Implementado

Incluye:

- CRUD
- asociación con productos

---

## Marcas

Estado

✅ Backend implementado

Incluye

- Entity
- Repository
- DTO
- Mapper
- Service
- Controller

Las marcas ya se encuentran integradas con Product.

Relación:

```
Product

↓

ManyToOne

↓

Brand
```

---

## Pedidos

Estado

✅ Implementado

Incluye:

- órdenes
- detalle de órdenes
- cambio de estado

Estados soportados

- Pendiente
- Pagado
- Enviado
- Entregado

---

## Mercado Pago

Estado

✅ Integrado

Incluye:

- creación de preferencias
- retorno
- webhook

Pendiente:

flujo final de producción.

---

# Seguridad

Actualmente:

Spring Security + Basic Auth

El panel administrativo utiliza autenticación.

En el futuro será reemplazado por JWT.

---

# API REST

Todos los recursos siguen el estilo REST.

Ejemplo

```
GET

POST

PUT

PATCH

DELETE
```

---

# DTO

Todas las entidades utilizan DTO.

Las entidades nunca se exponen directamente.

---

# Mapper

Se utiliza una capa Mapper para convertir:

```
Entity

↓

DTO

↓

Entity
```

La lógica de negocio nunca vive dentro del Mapper.

---

# Repositories

Todos los accesos a base de datos utilizan Spring Data JPA.

Se aprovecha la generación automática de consultas mediante nombres de métodos.

Ejemplo

```
findByNameContainingIgnoreCaseAndCategoryNameContainingIgnoreCaseAndBrandNameContainingIgnoreCase(...)
```

---

# Estado actual del Backend

Estado general

✅ Estable

Compila correctamente.

Swagger operativo.

Integración Product ↔ Brand terminada.

Listo para continuar el desarrollo del frontend.