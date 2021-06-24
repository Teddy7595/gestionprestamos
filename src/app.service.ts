import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'API nest en funcionamiento';
  }




}


// server {
//   server_name api.forgecode.xyz www.api.forgecode.xyz;
//   listen 51.195.148.17;
//   	#root /home/forgecode/domains/api.forgecode.xyz/public_html;
// 	listen 80;
//   listen 443 ssl;

//   access_log /var/log/virtualmin/api.forgecode.xyz/_access_log;
//   error_log /var/log/virtualmin/api.forgecode.xyz/_error_log;

// 	location / {
//         root  /home/forgecode/domains/api.forgecode.xyz/public_html;
//         proxy_set_header X-Forwarded-Proto $scheme;
//         proxy_set_header X-Forwarded-Host $host;
//         proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;

//         proxy_pass https://51.195.148.17:3500;
// 	}
// 	#root  /home/forgecode/domains/api.forgecode.xyz/public_html;

//   ssl_certificate /home/forgecode/domains/api.forgecode.xyz/ssl.cert;
//   ssl_certificate_key /home/forgecode/domains/api.forgecode.xyz/ssl.key;
// }



// server {
//   server_name api.forgecode.xyz www.api.forgecode.xyz;
//   listen 51.195.148.17;
//   	#root /home/forgecode/domains/api.forgecode.xyz/public_html;
// 	listen 80;
//   listen 443 ssl;

//   access_log /var/log/virtualmin/api.forgecode.xyz_access_log;
//   error_log /var/log/virtualmin/api.forgecode.xyz_error_log;

// 	location / {
//         root  /home/forgecode/domains/api.forgecode.xyz/public_html;
//         proxy_set_header X-Forwarded-Proto $scheme;
//         proxy_set_header X-Forwarded-Host $host;
//         proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;

//         proxy_pass https://51.195.148.17:3500;
// 	}
// 	#root  /home/forgecode/domains/api.forgecode.xyz/public_html;

//   ssl_certificate /home/forgecode/domains/api.forgecode.xyz/ssl.cert;
//   ssl_certificate_key /home/forgecode/domains/api.forgecode.xyz/ssl.key;
// }





