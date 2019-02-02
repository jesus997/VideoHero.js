# VideoHero.js
Simple plugins para JQuery que permite colocar un video al 100% de la pantalla. Ideal para headers tipo "Hero" con videos

## Requisitos
- JQuery ^3.3.0

## Opciones
| opcion | tipo | requerido |default | descripción |
|--|--|--|--|--|
| **provider** | string | si | youtube | Proveedor de la fuente del video. Valores validos: `youtube` y `custom` |
| **videoid** | string | solo si el proveedor es `youtube` | "" | ID del video de youtube. Generalmente se ve así: `Lwx47X_mc5A` |
| **source** | string o objeto | solo si el proveedor es `custom` | "" | Puede ser la url al video o bien un JSON. |
| **type** | string | solo si el proveedor es `custom` | "video/mp4" | Formato de video por default. *No aplica si se pasa un objeto JSON a `source`.* |
| **poster** | string | no | si el proveedor es `youtube` se coloca la miniatura del video o si el proveedor es `custom` de deja vacío | Caratula del video. |
| **log** | bool | no | false | Habilita o deshabilita el log. |
| **api.url** | string | no | https://you-link.herokuapp.com/ | Host de la API que se usará para optener los sources del video de Youtube. |
| **api.param** | string | no | ?url=https://www.youtube.com/watch?v= | Parámetro en la cual se enviará el ID del video. |
| **attrs.muted** | bool | no | true | Reproduce el video con o sin sonido. |
| **attrs.autoplay** | bool | no | true | Reproduce el video al cargar la página (auto-reproducción). |
| **attrs.loop** | bool | no | true | Al finalizar el video lo vuelve a reproducir. |
| **classes.*** | object | no | object[] | Permite personalizar las clases de los elementos HTML generados. **OJO!:** Si se modifica los estilos predefinidos pueden dejar de funcionar. |
| **i18n.*** | object | no | object[] | Permite personalizar los textos generados. |

## Ejemplos
### YouTube

    <div id="videohero"></div>
    ...
    $("#videohero").videohero({
    	provider: "youtube",
    	videoid: "Lwx47X_mc5A"
    });
    
### Auto alojado

    <div id="videohero"></div>
    ...
    $("#videohero").videohero({
    	provider: "custom",
    	videoid: "http://misitio.com/videos/hero.mp4"
    });
    
### Múltiples video sources
Se pueden establecer múltiples sources para un mismo video. Esto es útil si se quieren colocar diferentes formatos para el mismo video. Para hacerlo la sintaxis correcta es la siguiente:

    <div id="videohero"></div>
    ...
    $("#videohero").videohero({
    	provider: "custom",
    	poster: "http://misitio.com/images/hero.jpg",
    	source: [
		    	{
		    		"source":"http://misitio.com/videos/hero.mp4",
		    		"type":"video/mp4"
		    	}, 
		    	{
		    		"source":"http://misitio.com/videos/hero.webm", 
		    		"type":"video/webm"
		    	},
		    	...
	    	]
    });
    
### Activación por atributos

    <div class="my-videohero" data-provider="custom" data-source='[{"source":"http://techslides.com/demos/sample-videos/small.mp4", "type":"video/mp4"}, {"source":"http://techslides.com/demos/sample-videos/small.webm", "type":"video/webm"}]' data-poster="https://cdn-images-1.medium.com/max/1600/0*I-sI3u34g0ydRqyA"></div>
    ...
    $(".my-videohero").videohero();

