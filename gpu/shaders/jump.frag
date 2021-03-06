#extension GL_ARB_texture_rectangle : enable

uniform sampler2DRect tex0,tex1; /* the textures to read from */
uniform float width,height; /* window dimensions */
uniform float step; /* jump flooding step size */

void main()
{
	vec4 fragData0,colorData0;
	vec4 neighbor0;
	vec2 nCoord[8];

	float dist = 0.0;
	float newDist;
	int i;

	nCoord[0] = vec2( gl_FragCoord.s - step, gl_FragCoord.t - step );
	nCoord[1] = vec2( gl_FragCoord.s       , gl_FragCoord.t - step );
	nCoord[2] = vec2( gl_FragCoord.s + step, gl_FragCoord.t - step );
	nCoord[3] = vec2( gl_FragCoord.s - step, gl_FragCoord.t        );
	nCoord[4] = vec2( gl_FragCoord.s + step, gl_FragCoord.t        );
	nCoord[5] = vec2( gl_FragCoord.s - step, gl_FragCoord.t + step );
	nCoord[6] = vec2( gl_FragCoord.s       , gl_FragCoord.t + step );
	nCoord[7] = vec2( gl_FragCoord.s + step, gl_FragCoord.t + step );

	fragData0  = texture2DRect( tex0, gl_FragCoord.st );
	colorData0 = texture2DRect( tex1, gl_FragCoord.st );

	if( fragData0.a == 1.0 )
		dist = (fragData0.r-gl_FragCoord.s)*(fragData0.r-gl_FragCoord.s) + (fragData0.g-gl_FragCoord.t)*(fragData0.g-gl_FragCoord.t);

	for( i = 0; i < 8; ++i )
	{
		if( nCoord[i].s < 0.0 || nCoord[i].s >= width || nCoord[i].t < 0.0 || nCoord[i].t >= height )
			continue;

		neighbor0 = texture2DRect( tex0, nCoord[i] );

		if( neighbor0.a != 1.0 )
			continue;

		newDist = (neighbor0.r-gl_FragCoord.s)*(neighbor0.r-gl_FragCoord.s) + (neighbor0.g-gl_FragCoord.t)*(neighbor0.g-gl_FragCoord.t);

		if( fragData0.a != 1.0 || newDist < dist ) {
			fragData0 = neighbor0;
			colorData0 = texture2DRect( tex1, nCoord[i] );
			dist = newDist;
		}
	}

	gl_FragData[0] = fragData0;
	gl_FragData[1] = colorData0;
}
