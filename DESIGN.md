# Guía de estilos de eventos.wiki

Esta guía documenta el sistema visual que vive en `src/styles/global.css` y en los componentes de
`src/modules/shared/presentation/ui`. Es la referencia para cualquier pantalla nueva: si algo que vas a construir no
encaja aquí, primero se decide el patrón y luego se implementa.

La dirección es **contraste nocturno**: base oscura por defecto, tipografía geométrica, mucho aire y la portada del
evento como protagonista. Minimalista, pero no tímido. El rojo de marca se reserva para lo que de verdad tiene que
destacar.

Lienzo de referencia con las pantallas diseñadas:
<https://claude.ai/code/artifact/59cb9c76-a61a-405f-9c36-063d9a6f74bb>

## Fundamentos

### Color

Todos los colores son tokens en `oklch` definidos en `:root` (claro) y `.dark` (oscuro). Nunca escribas un color
literal en un componente: si te falta un tono, se añade como token.

| Token                | Claro            | Oscuro           | Para qué                      |
| -------------------- | ---------------- | ---------------- | ----------------------------- |
| `--background`       | `0.985 0.003 60` | `0.155 0.008 25` | Fondo de página               |
| `--foreground`       | `0.19 0.012 40`  | `0.97 0.004 60`  | Texto principal               |
| `--card`             | `1 0 0`          | `0.205 0.008 25` | Superficies elevadas          |
| `--popover`          | `1 0 0`          | `0.238 0.008 25` | Menús, diálogos, desplegables |
| `--muted-foreground` | `0.48 0.012 40`  | `0.72 0.012 40`  | Texto secundario              |
| `--border`           | `0.905 0.005 60` | `1 0 0 / 10%`    | Separadores y bordes          |
| `--input`            | `0.88 0.006 60`  | `1 0 0 / 16%`    | Bordes de campos              |

Los neutros llevan una pizca de croma cálido (matiz 25–60) en vez de gris puro. Es lo que evita que el modo oscuro se
vea azulado y que el claro se vea clínico.

#### Los tres rojos

El rojo de marca con texto blanco encima solo alcanza 3.5:1 de contraste, por debajo del 4.5:1 que exige la WCAG AA
para texto normal. Por eso el rojo se reparte en tres tokens con responsabilidades distintas:

| Token              | Valor                                                        | Cuándo se usa                                                                                                 |
| ------------------ | ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------- |
| `--brand`          | `0.6579 0.2309 17.07` en ambos modos                         | El punto de 5 px del menú activo. Nunca lleva texto encima.                                                   |
| `--primary`        | `0.55 0.21 17.07` en claro · `0.6579 0.2309 17.07` en oscuro | Texto y acentos en rojo. Cada modo usa el tono que contrasta con su fondo.                                    |
| `--primary-strong` | `0.55 0.21 17.07` en ambos modos                             | Rellenos sólidos que llevan texto blanco: botón primario, badge por defecto, página activa, día seleccionado. |

Regla práctica: **si hay texto blanco encima, es `primary-strong`**. Si el rojo es el texto, es `primary`. Si es la
marca y no hay texto de por medio, es `brand`.

El logotipo de la cabecera y el pie (`logo.tsx`) va en `primary`, no en `brand`: en claro se lee en el rojo apagado y
en oscuro en el vivo, igual que el resto de acentos rojos de la página.

#### Los assets de marca

Los ficheros de `public/` no pueden leer tokens, así que llevan el hex escrito. El rojo es el mismo
`primary-strong`, **`#CF1743`**, en todo lo que se ve sobre fondo claro o lleva la «e» blanca encima:

| Fichero                                                                                      | Rojo      | Nota                                                    |
| -------------------------------------------------------------------------------------------- | --------- | ------------------------------------------------------- |
| `logo.svg`, `logo.png`                                                                       | `#CF1743` | `logo.png` es el que viaja en los correos               |
| `logo-dark.svg`                                                                              | `#FF385C` | Para fondo oscuro, igual que la página en modo oscuro   |
| `icon.png`, `apple-touch-icon.png`, `android-chrome-*.png`, `favicon-96x96.png`, `favicon.*` | `#CF1743` | Tile rojo con la «e» en blanco                          |
| `site.webmanifest`                                                                           | `#CF1743` | `theme_color`, que es la barra del navegador en Android |

`logo.png` se regenera desde `logo.svg`; los iconos se recolorean desde el original para no perder el antialiasing
de la esquina redondeada. Si el rojo vuelve a cambiar, hay que rehacerlos todos: no hay build que los derive.

#### Tokens que no cambian con el tema

Van sobre fotos, así que su contraste no depende del modo:

| Token                  | Valor                       | Para qué                                                                        |
| ---------------------- | --------------------------- | ------------------------------------------------------------------------------- |
| `--scrim`              | Degradado de negro 88% → 6% | Capa sobre la portada que garantiza que el título se lea sobre cualquier imagen |
| `--overlay`            | `0.97 0.004 60`             | Fondo del chip de fecha sobre la portada                                        |
| `--overlay-foreground` | `0.17 0.01 30`              | Texto sobre `--overlay`                                                         |
| `--overlay-muted`      | `0.45 0.01 40`              | Texto secundario sobre `--overlay`                                              |

### Tipografía

**Space Grotesk** variable (300–700), autoalojada en `public/fonts/` y declarada con `@font-face` en `global.css`. No
se carga desde ningún CDN. La pila de reserva es `"Helvetica Neue", Helvetica, sans-serif`, de métricas parecidas para
que el salto al cargar la fuente no descoloque la maqueta.

| Rol              | Clases                                                                        | Dónde                                                      |
| ---------------- | ----------------------------------------------------------------------------- | ---------------------------------------------------------- |
| Display          | `text-4xl lg:text-7xl font-semibold tracking-[-0.035em]`, `line-height: 0.98` | Titular del hero                                           |
| Título de página | `text-3xl lg:text-5xl font-semibold tracking-tight`                           | Cabecera de listados, nombre de evento y de organización   |
| Sección          | `text-3xl font-semibold tracking-tight leading-none`                          | `SectionTitle`, los carruseles de la home                  |
| Tarjeta          | `text-[1.375rem] font-semibold leading-[1.16] tracking-tight`                 | Título de la tarjeta de evento                             |
| Cuerpo           | `text-lg leading-relaxed`                                                     | Descripciones y contenido de evento                        |
| Meta             | `text-sm`                                                                     | Ubicación, fechas, contadores                              |
| Versalita        | `text-[0.6875rem] uppercase tracking-[0.12em]`                                | Etiquetas de las filas de datos y el mes del chip de fecha |

Los titulares van siempre en `foreground`, no en rojo. El rojo aparece como palabra suelta acentuada dentro del titular
del hero, y poco más.

### Radios

La escala sale de `--radius: 0.875rem` (14 px):

| Clase          | Valor | Uso                                               |
| -------------- | ----- | ------------------------------------------------- |
| `rounded-sm`   | 10 px | Chips, etiquetas, ítems de menú                   |
| `rounded-md`   | 12 px | Campos, iconos enmarcados, badges                 |
| `rounded-lg`   | 14 px | Diálogos, popovers, chip de fecha                 |
| `rounded-xl`   | 18 px | Tarjetas                                          |
| `rounded-full` | —     | Todos los controles: botones, paginación, filtros |

### Iconos

Phosphor, importados siempre desde `@/ui/icons` (nunca directamente de `react-icons`). Trazo, nunca relleno, y heredan
el color del contenedor. Los iconos decorativos que acompañan a un texto que ya explica el significado van con
`aria-hidden="true"`.

## Componentes

### Botones y enlaces

`Button` y `Link` comparten `buttonVariants`. Todos los controles son **píldoras** (`rounded-full`).

| Variante      | Aspecto                                                                            |
| ------------- | ---------------------------------------------------------------------------------- |
| `default`     | Relleno `primary-strong` con texto blanco. Una sola acción principal por pantalla. |
| `outline`     | Borde y fondo transparente. Acción secundaria.                                     |
| `secondary`   | Relleno neutro. Acciones de gestión.                                               |
| `ghost`       | Sin borde. Iconos de barra.                                                        |
| `link`        | Texto apagado que pasa a `foreground` al pasar por encima. Navegación.             |
| `destructive` | Solo para borrar.                                                                  |

Tamaños: `sm` 32 px, `default` 36 px, `lg` 44 px, `icon` 36 px cuadrado. En móvil, cualquier control que se pulse debe
medir 44 px o más.

### Tarjeta de evento

La pieza que más se repite. Es la portada, no una caja que contiene una portada: imagen a sangre, `--scrim` encima y
todo el texto en blanco sobre ella.

Anatomía, de arriba abajo:

1. **Chip de fecha** arriba a la izquierda, en `--overlay`. Día en 20/600 y mes en versalitas. Es el único elemento
   claro sobre la foto y funciona como ancla de lectura. El año solo aparece cuando el evento no es del año en curso
   —«12 mar» frente a «14 nov 2025»—, para que los listados de pasados no pierdan la referencia sin cargar de ruido
   la tarjeta del caso habitual.
2. **Precio** arriba a la derecha, solo si el evento tiene entradas. Si es gratuito **se omite el elemento entero**, no
   se escribe «Gratis».
3. **Etiquetas** en blanco al 16%, sin el color por evento. El color de la portada ya diferencia una tarjeta de otra;
   las etiquetas de color competían con ella. `tagColor` sigue en la interfaz por compatibilidad, pero no se pinta.
4. **Título** a dos líneas como máximo.
5. **Meta**: ubicación y, solo en eventos de varios días, hasta cuándo dura.

Altura mínima `22rem`. La portada hace `scale(1.06)` al pasar por encima, respetando `prefers-reduced-motion`.

### Etiquetas (`Badge`)

`variant="outline"` con `tracking-[0.08em]` en el detalle de evento. La variante `default` (relleno
`primary-strong`) queda para estados, no para taxonomías.

### Títulos

Dos componentes, y ninguna página debería escribir su propio titular a mano:

- `PageTitle` renderiza el `<h1>` de la página: `text-3xl lg:text-5xl`. Lo usan los listados, el calendario, los
  errores y las nuevas funcionalidades.
- `SectionTitle` renderiza un `<h2>` de 30 px para las secciones dentro de una página, como los carruseles de la home.

En pantallas compactas donde un `<h1>` de 48 px no cabe —el panel de login— se escribe un `<h1>` propio de 24 px. Sigue
habiendo un solo `h1` por página.

### Tabs

Dos implementaciones con el mismo aspecto: `LinkTabs` cuando cada pestaña es una URL (detalle de evento, perfil de
organización) y el primitivo `Tabs` cuando el cambio es en cliente (formularios de edición).

Subrayado de 2 px en `primary` sobre el ítem activo, resto en `muted-foreground`, separación de 28 px y línea inferior
a todo el ancho. La lista se desplaza en horizontal en móvil en lugar de romper el ancho de la página.

### Paginación

Píldoras de 36 px. La página actual va en `primary-strong` con texto blanco; las demás en `muted-foreground`. Las
flechas de anterior y siguiente llevan borde.

### Filas de datos (`EventDataRow`)

Semánticamente son `<dl>` con `<dt>` y `<dd>`: icono enmarcado de 40 px, etiqueta en versalitas y valor en 14/500.

### Barra de filtros

`SearchFiltersBar` agrupa los filtros de una página con separación de 24 px y salto de línea en pantallas estrechas.
Dibuja un separador inferior por defecto; las páginas cuyo contenido ya trae su propio borde —el calendario— lo
desactivan con `divider={false}` para no doblar la línea.

Cuando conviven un conmutador de ámbito y un filtro, el conmutador va a la izquierda y el filtro al extremo opuesto con
`md:ml-auto`. Las pestañas usadas como filtro se declaran `w-fit border-b-0`: son un control, no la barra de pestañas
de la página, así que ni ocupan el ancho ni aportan línea propia.

### Formularios

Los campos —`Input`, `Textarea`, `Select` y el `input.input` de `base-input`— comparten borde `--input`, fondo `--card`,
`rounded-md` y anillo de foco de 3 px. El texto del marcador de posición va en `muted-foreground`, y el estado de error
tiñe borde y texto con `destructive`.

Los formularios largos se organizan en grupos separados por `border-t pt-6`, con un encabezado de grupo en
`text-xl font-semibold` —no un título de sección— y `space-y-4` entre campos.

### Menú

El ítem activo se marca con un **punto de `--brand` de 5 px delante del texto**, y el texto pasa a `foreground`. No se
tiñe el enlace de rojo: a 14 px no llegaría a contraste AA, y el punto se lee mejor de un vistazo.

## Accesibilidad

- **Contraste**: texto normal 4.5:1, texto grande y elementos no textuales 3:1. El reparto de los tres rojos existe
  precisamente para cumplirlo; no lo deshagas usando `primary` como fondo de un botón.
- **Zonas táctiles**: 44 px mínimo en móvil.
- **Foco**: anillo de `--ring` (3 px) que ya viene en `buttonVariants` y en los campos. No lo quites.
- **Iconos**: decorativos con `aria-hidden`, informativos con etiqueta accesible.
- **Movimiento**: cualquier animación va dentro de `@media (prefers-reduced-motion: no-preference)`.

## Cómo escribir estilos

- Tailwind con tokens. Nada de `text-gray-900`, `bg-slate-50` ni hexadecimales sueltos.
- En componentes `.astro`, clases semánticas en un bloque `<style>` con `@reference` y `@apply`, como el resto del
  repositorio.
- En React, `cn()` para componer y `cva` para variantes.
- Un color nuevo se añade como token en los dos modos antes de usarse.

## Pendiente

- `@fontsource-variable/inter` sigue declarado en `package.json` aunque ya no se importa. No se puede quitar hasta que
  se pueda regenerar el lockfile: hoy `pnpm add` y `pnpm remove` fallan con `ERR_PNPM_EXOTIC_SUBDEP` por una
  subdependencia de `@astrojs/check` ajena a este cambio.
- Las plantillas de correo de `src/modules/emails` mantienen colores literales a propósito: los clientes de correo no
  soportan variables CSS. Si cambia la paleta, hay que actualizarlas a mano.
