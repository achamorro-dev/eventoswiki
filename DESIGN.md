# Guía de estilos de eventos.wiki

Esta guía documenta el sistema visual que vive en `src/styles/global.css` y en los componentes de
`src/modules/shared/presentation/ui`. Es la referencia para cualquier pantalla nueva: si algo que vas a construir no
encaja aquí, primero se decide el patrón y luego se implementa.

La dirección es **contraste nocturno**: base oscura por defecto, tipografía geométrica, mucho aire y la portada del
evento como protagonista. Minimalista, pero no tímido. El verde de marca se reserva para lo que de verdad tiene que
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

#### Los tres verdes

El verde de marca, **`#6FC0AB`**, es un menta claro: con texto blanco encima se queda en 2.1:1 y como texto sobre el
fondo claro en 2.1:1, muy por debajo del 4.5:1 que exige la WCAG AA. Sobre fondo oscuro, en cambio, llega a 9.1:1. Por
eso el verde se reparte en tres tokens con responsabilidades distintas:

| Token              | Valor                                                        | Cuándo se usa                                                                                                   |
| ------------------ | ------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------- |
| `--brand`          | `0.7498 0.086 175.28` en ambos modos                         | El punto de 5 px del menú activo. Nunca lleva texto encima.                                                     |
| `--primary`        | `0.52 0.086 175.28` en claro · `0.7498 0.086 175.28` en oscuro | Texto y acentos en verde. Cada modo usa el tono que contrasta con su fondo.                                     |
| `--primary-strong` | `0.7498 0.086 175.28` en ambos modos                         | Rellenos sólidos: botón primario, badge por defecto, página activa, día seleccionado. Llevan texto **oscuro**. |

La diferencia importante frente al rojo anterior: **`--primary-foreground` ya no es blanco, es casi negro**
(`0.19 0.012 40`). El menta es demasiado claro para sostener texto blanco, así que todo lo que se rellena con
`primary-strong` lleva el texto oscuro encima, y ahí sí llega a 8.6:1. No lo vuelvas a poner en blanco.

Regla práctica: **si es un relleno sólido de marca, es `primary-strong` y el texto encima es `primary-foreground`**.
Si el verde es el texto, es `primary`. Si es la marca y no hay texto de por medio, es `brand`.

El logotipo de la cabecera y el pie (`logo.tsx`) va en `primary`, no en `brand`: en claro se lee en el verde profundo
y en oscuro en el menta, igual que el resto de acentos verdes de la página.

#### El logotipo de la web

`logo.tsx` es el lockup completo, «eventos.wiki by sirviendo.código;», dibujado en línea con clases de token para que
responda al tema. Nunca lleva hex escrito. El reparto es:

| Parte                | Clase                   | Por qué                                                        |
| -------------------- | ----------------------- | -------------------------------------------------------------- |
| La «e» y «eventos»   | `stroke-primary` / `fill-primary` | El acento verde de la página                          |
| «wiki»               | `fill-wordmark`         | El azul de marca, o casi blanco en oscuro                      |
| «by»                 | `fill-muted-foreground` | Preposición subordinada: pesa menos que el nombre              |
| «sirviendo.código;»  | `fill-wordmark`         | Mismo rango que «wiki»                                         |

El SVG de origen, `public/logo-by-sc.svg`, viene con los hex mezclados de los dos modos (menta de oscuro, azul de
claro y un «by» en `#FAFAFA` invisible sobre blanco). Sirve como fuente del trazado, no de los colores: si lo
reexportas, vuelve a mapear las cuatro clases a tokens.

El lockup es más alto que el logotipo suelto —relación 3.16 frente a 4.27—, así que la cabecera pasó a `h-16 lg:h-20`
para que quepa. Si cambias el tamaño del logo, comprueba esa altura: el header la tiene fija.

La coletilla es tipografía muy pequeña: a `w-56` ronda los 6,5 px de altura de x. Funciona como firma, no como texto
que alguien vaya a leer, y por eso no se le exige contraste de texto normal.

#### El wordmark

La palabra «wiki» del logotipo tiene token propio, `--wordmark`: `0.3825 0.0482 250.25` (**`#2F455C`**, un azul
pizarra) en claro y `0.9851 0 0` (**`#FAFAFA`**) en oscuro. Antes iba en `fill-foreground`, es decir en el color de
texto del tema, y por eso no podía tener color de marca propio.

No lo confundas con `--primary-foreground`, que sigue en `0.19 0.012 40` y es el texto que va **encima** de los
rellenos verdes. Son dos oscuros distintos con trabajos distintos: uno es identidad, el otro es legibilidad sobre el
menta.

El azul solo vale sobre fondo claro: sobre el fondo oscuro se queda en 2:1, y por eso en modo oscuro el wordmark es
casi blanco, igual que en `logo-dark.svg`.

`--ring` sigue a `primary`, no a `primary-strong`: un anillo de foco en menta sobre el fondo claro se quedaría en
2.1:1 y dejaría de verse.

#### El verde de éxito

`--success` era un teal (`0.6 0.118 184.704`) que con la marca en rojo no chocaba con nada. Con la marca en verde
quedaba a diez grados de matiz de ella, así que se ha movido a un verde más amarillo, `0.5285 0.1061 154.6`
(**`#2E7D4F`**), que se distingue del verde de marca y de paso sube de 3.5:1 a 4.8:1 con su texto blanco.
`--destructive` sigue en rojo y ahora contrasta mejor con el resto del sistema.

#### Los assets de marca

Los ficheros de `public/` no pueden leer tokens, así que llevan el hex escrito. Cada uno lleva la pareja que le
corresponde según el fondo sobre el que se ve:

| Fichero                                                                                      | Marca     | Wordmark  | Nota                                                    |
| -------------------------------------------------------------------------------------------- | --------- | --------- | ------------------------------------------------------- |
| `logo.svg`, `logo.png`                                                                       | `#227966` | `#2F455C` | `logo.png` es el que viaja en los correos               |
| `logo-dark.svg`                                                                              | `#6FC0AB` | `#FAFAFA` | Para fondo oscuro, igual que la página en modo oscuro   |
| `og.jpg`                                                                                     | `#227966` | `#2F455C` | La previsualización social, wordmark sobre blanco       |
| `icon.png`, `apple-touch-icon.png`, `android-chrome-*.png`, `favicon-96x96.png`, `favicon.*` | `#6FC0AB` | `#2F455C` | Tile menta con la «e» en azul                           |
| `site.webmanifest`                                                                           | `#6FC0AB` | —         | `theme_color`, que es la barra del navegador en Android |

Ojo con el tile: al pasar de rojo a menta la «e» dejó de poder ser blanca (2.1:1). Ahora va en el azul del wordmark,
`#2F455C`, que da 4.6:1 sobre el menta. Cumple AA y a 48 px se lee sin problema, pero es bastante menos peso que el
`#191210` que llevaba antes: si algún día el favicon se ve flojo a 16 px, ese es el número a subir.

`logo.svg` y `logo.png` son el mismo diseño y deben ir a la vez; los iconos y `og.jpg` se recolorean desde el
original para no perder el antialiasing de la esquina redondeada. Si alguno de los dos colores vuelve a cambiar, hay
que rehacerlos todos: no hay build que los derive.

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

Los titulares van siempre en `foreground`, no en verde. El verde aparece como palabra suelta acentuada dentro del titular
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
   las etiquetas de color competían con ella. El campo `tagColor` se eliminó: las etiquetas ya no llevan color propio.
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
tiñe el enlace de verde: a 14 px no llegaría a contraste AA, y el punto se lee mejor de un vistazo.

## Accesibilidad

- **Contraste**: texto normal 4.5:1, texto grande y elementos no textuales 3:1. El reparto de los tres verdes
  existe precisamente para cumplirlo. Las dos formas de deshacerlo: poner texto blanco sobre `primary-strong` (el
  menta solo da 2.1:1 con blanco) o usar `brand` como color de texto sobre el fondo claro.
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
