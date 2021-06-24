import { Injectable } from '@nestjs/common';

import { rolesMenu } from 'src/Modules/role/rolesMenu/rolesMenu.index';


@Injectable()
export class SetUserMenuService {


    setMenu(role, subRole = null): any{

        console.log('el rol', role);

        const menu = {
            sessionBaseUrl: rolesMenu.sessionBaseUrl,
            general: rolesMenu.GENERAL,
            role: rolesMenu[role]
        };

        // menu.push({
        //     sessionBaseUrl: rolesMenu.sessionBaseUrl
        // })

        // menu.push({
        //     general: rolesMenu.GENERAL
        // });

        // menu.push({
        //     role: rolesMenu[role]
        // })



        return menu;



    }

}
