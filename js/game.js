function game(){

    const xAxis = ["A","B","C","D","E","F","G","H"]
    const yAxis = [1,2,3,4,5,6,7,8];
    var action = [];
    function getPosition(grid) {
        var gridid = $(grid).attr("id");
        var x = gridid[0];
        var y = parseInt(gridid[1]);
        return [x,y];
    }
    function checkmate(piece) {
        var attackableGrids = attackableScope(piece);
        for (var gridId of attackableGrids) {
            var grid = $("#"+gridId);
            if ($(grid.children()[0]).hasClass("king")) {
                color([gridId], "checkmate");
            }
        }
    }

    // 结束游戏
    function finish() {
        if (document.getElementById("black-king") == undefined) {
            alert("白方胜利");
            return;
        }

        if (document.getElementById("white-king") == undefined) {
            alert("黑方胜利");
            return;
        }
    }

    // 着色
    function color(grids, className) {
        for (var grid of grids) {
            $("#"+grid).toggleClass(className);
        }
    }

    // 行动前褪色
    function clearBaforeMove() {
        $(".grid").removeClass("active");
        $(".grid.movable-scope").removeClass("movable-scope");
        $(".grid.attackable-scope").removeClass("attackable-scope");
        $(".grid.checkmate").removeClass("checkmate");
    }

    // 行动后褪色
    function clearAfterMove() {
        $(".grid.active").removeClass("active");
        $(".grid.movable-scope").removeClass("movable-scope");
        $(".grid.attackable-scope").removeClass("attackable-scope");
    }

    // 清除行动记录
    function clearAction() {
        while (action.length > 0) {
            action.pop();
        }
    }

    $(".grid").click(function () {
        clearBaforeMove();
        var $grid = $(this);
        $grid.toggleClass("active");

        if (action.length == 0) {
            if ($grid.children(".chess").length == 1) {
                var $piece1 = $($grid.children(".chess")[0]);
                
                var movableGrids = movableScope($piece1);
                color(movableGrids, "movable-scope");

                var attackableGrids = attackableScope($piece1);
                color(attackableGrids, "attackable-scope");

                action.push($piece1.attr("color"));
                action.push($piece1.attr("type"));
                action.push($grid.attr("id"));
            }
            return;
        }

        if (action.length == 3) {
            var $fromGrid = $("#"+action[2]);
            var $piece1 = $($fromGrid.children(".chess")[0]);

            var movableGrids = movableScope($piece1);
            var attackableGrids = attackableScope($piece1);

            // 目标格子
            var gridId = $grid.attr("id");

            if (gridId != action[2] && (movableGrids.indexOf(gridId) != -1 || attackableGrids.indexOf(gridId) != -1)) {
                // 目标格子处在棋子的可移动范围或者可攻击范围内

                var $fromGrid = $("#"+action[2]);
                var $toGrid = $grid;

                // 根据目标格子上有没有敌方的棋子, 选择攻击或者移动
                if ($toGrid.children(".chess").length > 0) {
                    // 目标格子有其他棋子

                    // 目标格子上的棋子
                    var $piece2 = $($toGrid.children(".chess")[0]);
                    if ($piece1.attr("color") != $piece2.attr("color")) {
                        // 目标格子上的棋子是敌方的棋子

                        // 攻击
                        $fromGrid.remove($piece1);
                        $toGrid.empty();
                        $toGrid.append($piece1);
                    }

                } else {
                    // 目标格子有其他棋子

                    // 移动
                    $fromGrid.remove($piece1);
                    $toGrid.append($piece1);
                }

                // 检查棋子类型是不是离开了初始位置的士兵
                if ($piece1.hasClass("initial")) {
                    $piece1.removeClass("initial");
                }


                /*棋子移动或者攻击完成后, 检查国王是否存在, 是否被将军*/
                checkmate($piece1);
                finish();
            } else {
                // 目标格子不处在棋子的可移动范围或者可攻击范围内

                // 清除行动记录
                clearAction();
                return;
            }

            action.push(gridId);
            return;
        }

        if (action.length == 4) {
            if ($grid.children(".chess").length == 1) {
                var $piece1 = $($grid.children(".chess")[0]);

                if ($piece1.attr("color") != action[0]) {
                    var movableGrids = movableScope($piece1);
                    color(movableGrids, "movable-scope");

                    var attackableGrids = attackableScope($piece1);
                    color(attackableGrids, "attackable-scope");

                    clearAction();
                    action.push($piece1.attr("color"));
                    action.push($piece1.attr("type"));
                    action.push($grid.attr("id"));
                }                
            }
            return;
        }
    });
    
    function movableScope(piece)
    {
        var allscopes = [];
        var cur_position = getPosition(piece.parent());
        if(piece.hasClass("pawn")){
            if(piece.hasClass("white")){
                var $grid = $("#"+cur_position[0]+(cur_position[1]+1));
                var $grid2 = $("#"+cur_position[0]+(cur_position[1]+2));
                if(piece.hasClass("initial")){
                    if ($grid.children().length==0){
                        allscopes.push($grid.attr("id"));
                        if($grid2.children().length==0){
                            allscopes.push($grid2.attr("id"));
                        }
                    }
                }
                else{
                    if ($grid.children().length==0){
                        allscopes.push($grid.attr("id"));
                    }
                }
            } else {
                var $grid = $("#"+cur_position[0]+(cur_position[1]-1));
                var $grid2 = $("#"+cur_position[0]+(cur_position[1]-2));
                if(piece.hasClass("initial")){
                    if ($grid.children().length==0){
                        allscopes.push($grid.attr("id"));
                        if($grid2.children().length==0){
                            allscopes.push($grid2.attr("id"));
                        }
                    }
                }
                else{
                    if ($grid.children().length==0){
                        allscopes.push($grid.attr("id"));
                    }
                }
            }
            return allscopes;
        } 
        if(piece.hasClass("king")){
            var centerGrid = piece.parent();
            var tempGrid
            var directions = [top, topright, right, bottomright, bottom, bottomleft, left, topleft];
            for(var direction of directions){
                tempGrid = direction(centerGrid);
                if(tempGrid != undefined && tempGrid.children(".chess").length == 0) {
                    allscopes.push(tempGrid.attr("id"));
                }
            }
            return allscopes;
        }
        if (piece.hasClass("queen")) {
            var centerGrid = piece.parent();
            var tempGrid;
            var directions = [top, topright, right, bottomright, bottom, bottomleft, left, topleft];

            for (var direction of directions) {
                tempGrid = direction(centerGrid);
                while (tempGrid != undefined) {
                    if (tempGrid.children().length == 0) {
                        allscopes.push(tempGrid.attr("id"));
                        tempGrid = direction(tempGrid);
                    } else {
                        break;
                    }
                }
            }

            return allscopes;
        }
        if (piece.hasClass("bishop")) {
            var centerGrid = piece.parent();
            var tempGrid;
            var directions = [topright, bottomright, bottomleft, topleft];

            for (var direction of directions) {
                tempGrid = direction(centerGrid);
                while (tempGrid != undefined) {
                    if (tempGrid.children().length == 0) {
                        allscopes.push(tempGrid.attr("id"));
                        tempGrid = direction(tempGrid);
                    } else {
                        break;
                    }
                }
            }
            
            return allscopes;
        }
        if (piece.hasClass("rook")) {
            var centerGrid = piece.parent();
            var tempGrid;
            var directions = [top, right, bottom, left];

            for (var direction of directions) {
                tempGrid = direction(centerGrid);
                while (tempGrid != undefined) {
                    if (tempGrid.children().length == 0) {
                        allscopes.push(tempGrid.attr("id"));
                        tempGrid = direction(tempGrid);
                    } else {
                        break;
                    }
                }
            }

            return allscopes;
        }
        if (piece.hasClass("knight")) {
            var centerGrid = piece.parent();
            var nearGrid, farGrid;
            var routes = [
                [top, [topleft, topright]],
                [right, [topright, bottomright]],
                [bottom, [bottomleft, bottomright]],
                [left, [topleft, bottomleft]] 
            ];

            for (var route of routes) {
                var unidirection = route[0];
                var bidirection = route[1];

                nearGrid = unidirection(centerGrid);
                if (nearGrid != undefined) {
                    for (var direction of bidirection) {
                        farGrid = direction(nearGrid);
                        if (farGrid != undefined && farGrid.children(".chess").length == 0) {
                            allscopes.push(farGrid.attr("id"));
                        }
                    }
                }
            }

            return allscopes;
        }
    }
    function attackableScope(piece) {
        var scope = [];

        // 士兵
        if (piece.hasClass("pawn")) {
            var centerGrid = piece.parent();

            if (piece.hasClass("white")) {
                var topLeftGrid = topleft(centerGrid);
                var topRightGrid = topright(centerGrid);
                for (var grid of [topLeftGrid, topRightGrid]) {
                    if (grid != undefined && grid.children().length == 1 && $(grid.children()[0]).attr("color") != piece.attr("color")) {
                        scope.push(grid.attr("id"));
                    }
                }            
            } else {
                var bottomLeftGrid = bottomleft(centerGrid);
                var bottomRightGrid = bottomright(centerGrid);

                for (var grid of [bottomLeftGrid, bottomRightGrid]) {
                    if (grid != undefined && grid.children().length == 1 && $(grid.children()[0]).attr("color") != piece.attr("color")) {
                        scope.push(grid.attr("id"));
                    }
                }
            }
            return scope;
        }

        // 国王
        if (piece.hasClass("king")) {
            var centerGrid = piece.parent();
            var tempGrid;
            var directions = [top, topright, right, bottomright, bottom, bottomleft, left, topleft];

            for (var direction of directions) {
                tempGrid = direction(centerGrid);
                if (tempGrid != undefined && tempGrid.children(".chess").length == 1 && $(tempGrid.children(".chess")[0]).attr("color") != piece.attr("color")) {
                    scope.push(tempGrid.attr("id"));
                }
            }

            return scope;
        }

        // 王后
        if (piece.hasClass("queen")) {
            var centerGrid = piece.parent();
            var tempGrid;
            var directions = [top, topright, right, bottomright, bottom, bottomleft, left, topleft];

            for (var direction of directions) {
                tempGrid = direction(centerGrid);            
                while (tempGrid != undefined) {
                    if (tempGrid.children().length == 1) {
                        if ($(tempGrid.children()[0]).attr("color") != piece.attr("color")) {
                            scope.push(tempGrid.attr("id"));                        
                        }
                        break;                   
                    } else {
                        tempGrid = direction(tempGrid);
                    }
                }
            }

            return scope;
        }

        // 主教
        if (piece.hasClass("bishop")) {
            var centerGrid = piece.parent();
            var tempGrid;
            var directions = [topright, bottomright, bottomleft, topleft];

            for (var direction of directions) {
                var tempGrid = direction(centerGrid);            
                while (tempGrid != undefined) {
                    if (tempGrid.children().length == 1) {
                        if ($(tempGrid.children()[0]).attr("color") != piece.attr("color")) {
                            scope.push(tempGrid.attr("id"));                        
                        }
                        break;                   
                    } else {
                        tempGrid = direction(tempGrid);
                    }
                }
            }

            return scope;
        }

        // 骑士
        if (piece.hasClass("knight")) {
            var centerGrid = piece.parent();
            var nearGrid, farGrid;

            var routes = [
                [top, [topleft, topright]],
                [right, [topright, bottomright]],
                [bottom, [bottomleft, bottomright]],
                [left, [topleft, bottomleft]] 
            ];

            for (var route of routes) {
                var unidirection = route[0];
                var bidirection = route[1];

                nearGrid = unidirection(centerGrid);
                if (nearGrid != undefined) {
                    for (var direction of bidirection) {
                        farGrid = direction(nearGrid);
                        if (farGrid != undefined && farGrid.children(".chess").length == 1 && $(farGrid.children(".chess")[0]).attr("color") != piece.attr("color")) {
                            scope.push(farGrid.attr("id"));
                        }
                    }
                }
            }

            return scope;
        }

        // 城堡
        if (piece.hasClass("rook")) {
            var centerGrid = piece.parent();
            var tempGrid;
            var directions = [top, right, bottom, left];

            for (var direction of directions) {
                var tempGrid = direction(centerGrid);            
                while (tempGrid != undefined) {
                    if (tempGrid.children().length == 1) {
                        if ($(tempGrid.children()[0]).attr("color") != piece.attr("color")) {
                            scope.push(tempGrid.attr("id"));                        
                        }
                        break;                   
                    } else {
                        tempGrid = direction(tempGrid);
                    }
                }
            }

            return scope;
        }
    }

    function isMarginTop(grid) {
        var position = getPosition(grid);
        return position[1] == yAxis[7];
    }

    function isMarginBottom(grid) {
        var position = getPosition(grid);
        return position[1] == yAxis[0];
    }

    function isMarginLeft(grid) {
        var position = getPosition(grid);
        return position[0] == xAxis[0];
    }

    function isMarginRight(grid) {
        var position = getPosition(grid);
        return position[0] == xAxis[7];
    }

    function top(grid) {
        var position = getPosition(grid);
        if (isMarginTop(grid) == true) {
            return undefined;
        } else {
            return $("#"+position[0]+(position[1]+1));
        }
    }

    function bottom(grid) {
        var position = getPosition(grid);
        if (isMarginBottom(grid) == true) {
            return undefined;
        } else {
            return $("#"+position[0]+(position[1]-1));
        }
    }

    function left(grid) {
        var position = getPosition(grid);
        if (isMarginLeft(grid) == true) {
            return undefined;
        } else {
            return $("#"+xAxis[xAxis.indexOf(position[0])-1]+position[1]);
        }        
    }

    function right(grid) {
        var position = getPosition(grid);
        if (isMarginRight(grid) == true) {
            return undefined;
        } else {
            return $("#"+xAxis[xAxis.indexOf(position[0])+1]+position[1]);
        }
    }

    function topleft(grid) {
        var position = getPosition(grid);
        if (isMarginTop(grid) || isMarginLeft(grid)) {
            return undefined;
        } else {
            return $("#"+xAxis[xAxis.indexOf(position[0])-1]+(position[1]+1));
        }
    }

    function topright(grid) {
        var position = getPosition(grid);
        if (isMarginTop(grid) || isMarginRight(grid)) {
            return undefined;
        } else {
            return $("#"+xAxis[xAxis.indexOf(position[0])+1]+(position[1]+1));
        }
    }

    function bottomleft(grid) {
        var position = getPosition(grid);
        if (isMarginBottom(grid) || isMarginLeft(grid)) {
            return undefined;
        } else {
            return $("#"+xAxis[xAxis.indexOf(position[0])-1]+(position[1]-1));
        }
    }

    function bottomright(grid) {
        var position = getPosition(grid);
        if (isMarginBottom(grid) || isMarginRight(grid)) {
            return undefined;
        } else {
            return $("#"+xAxis[xAxis.indexOf(position[0])+1]+(position[1]-1));
        }
    }
}

game();
