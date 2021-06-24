export interface RoutesInterface
{
	n_routes              ?:number//numero de rutas que maneja un enrutador hasta el día de generar traza
	nb_route_low  	      ?:number//numero de negocios en la ruta con menos prestamos (negocios)
	nb_route_high 	      ?:number//numero de negocios en la ruta con mas prestamos (negocios)
	//value_bussines_high   ?:number//valor del prestamo mas alto
	//value_bussines_low    ?:number//valor del prestamo mas bajo
	enrutador_id	      ?:string//:id del enrutador ncargado
	route_id_bc_low       ?:string//id de la ruta con menos prestamos (negocios)
	route_id_bc_high      ?:string//id de la ruta con mas prestamos (negocios)
	//idRoute_low_bussines  ?:string//id de la ruta con el prestamo (negocio) mas bajo
	//idRoute_high_bussines ?:string//id de la ruta con el prestamo (negocio) mas alto
}