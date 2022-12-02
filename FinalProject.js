
        // Creates counters to track user accuracy
        var targetGreenCounter = 0;
        var targetRedCounter = 0;
        var targetWhiteCounter = 0;
        var targetBlueCounter = 0;
        var missesCounter = 0;

        function main()
        {
            fetchQuotes()

            let timer = setInterval(fetchQuotes, 15000);

            targetIntro();
            targetShootingRange();
            slowMovingTarget();

            // Always keep refreshing results
            // Put it at 1.5 seconds and realistically, could be longer
            // to improve performance
            let timerId = setInterval(displayResults, 1500);
        }

        /**
         * The starting target
         */
        function targetIntro()
        {
            let snap = Snap("#target-intro")

            // Creates the four circles that make up the target
            let circle1 = snap.circle(600, 350, 190);
            let circle2 = snap.circle(600, 350, 140);
            let circle3 = snap.circle(600, 350, 80);
            let circle4 = snap.circle(600, 350, 20);

            // Sets the attribute for all circles required
            setCircles(circle1, circle2, circle3, circle4);

            // Creates the functionality for everything to change colors, based
            // on which sub circle was clicked. Helps the user see their accuracy
            circle1.mousedown(() => { circleClicked(circle1, circle2, circle3, circle4, circle1.attr("fill"), ""); });
            circle2.mousedown(() => { circleClicked(circle1, circle2, circle3, circle4, circle2.attr("fill"), ""); });
            circle3.mousedown(() => { circleClicked(circle1, circle2, circle3, circle4, circle3.attr("fill"), ""); });
            circle4.mousedown(() => { circleClicked(circle1, circle2, circle3, circle4, circle4.attr("fill"), ""); });

            // Groups all circles together, so that these functions can be
            // used on any part of the target
            let startingTargetGroup = snap.g(circle1, circle2, circle3, circle4)
            startingTargetGroup.drag(onDrag, onBegin);
            startingTargetGroup.hover(hoverOver, hoverOut);
            startingTargetGroup.mouseup(() => { mouseUp(circle1, circle2, circle3, circle4); });
            startingTargetGroup.touchstart(mobileTouch);
        }


        /**
         * The shooting range target
         */
        function targetShootingRange()
        {
            let targetSnap = Snap("#target");

            // Creates 4 circles in the svg segment with id target
            let circle1 = targetSnap.circle(600, 350, 150);
            let circle2 = targetSnap.circle(600, 350, 100);
            let circle3 = targetSnap.circle(600, 350, 50);
            let circle4 = targetSnap.circle(600, 350, 20);

            // Used to keep track of misses
            let backgroundCircle = targetSnap.circle(600, 350, 1000);

            // Sets the attributes for all of the necessary circles
            setCircles(circle1, circle2, circle3, circle4);

            // Groups all circles together
            let shootingRangeGroup = targetSnap.g(circle1, circle2, circle3, circle4);


            // Changes the color of the target based on user accuracy
            circle1.mousedown(() => { circleClicked(circle1, circle2, circle3, circle4, circle1.attr("fill"), "blue"); });
            circle2.mousedown(() => { circleClicked(circle1, circle2, circle3, circle4, circle2.attr("fill"), "white"); });
            circle3.mousedown(() => { circleClicked(circle1, circle2, circle3, circle4, circle3.attr("fill"), "red"); });
            circle4.mousedown(() => { circleClicked(circle1, circle2, circle3, circle4, circle4.attr("fill"), "green"); });

            // Track the misses
            backgroundCircle.mousedown(function() {
                missesCounter += 1;
                console.log(missesCounter);
            })

            // Moves the target when its clicked to a random location
            shootingRangeGroup.mouseup(() => { shootingRange(shootingRangeGroup, circle1, circle2, circle3, circle4); });
            shootingRangeGroup.hover(hoverOver, hoverOut);
        }    

        /**
         * The slow moving target 
         */
        function slowMovingTarget()
        {
            let movingTargetSnap = Snap("#moving-target");

            // Creates 4 circles in the svg segment with id target
            let circle1 = movingTargetSnap.circle(600, 350, 150);
            let circle2 = movingTargetSnap.circle(600, 350, 100);
            let circle3 = movingTargetSnap.circle(600, 350, 50);
            let circle4 = movingTargetSnap.circle(600, 350, 20);

            // Sets the attributes for all of the necessary circles
            setCircles(circle1, circle2, circle3, circle4);

            // Changes the color of the target based on user accuracy
            circle1.mousedown(() => { circleClicked(circle1, circle2, circle3, circle4, circle1.attr("fill"), ""); });
            circle2.mousedown(() => { circleClicked(circle1, circle2, circle3, circle4, circle2.attr("fill"), ""); });
            circle3.mousedown(() => { circleClicked(circle1, circle2, circle3, circle4, circle3.attr("fill"), ""); });
            circle4.mousedown(() => { circleClicked(circle1, circle2, circle3, circle4, circle4.attr("fill"), ""); });

            // Groups all circles together
            let movingGroup = movingTargetSnap.g(circle1, circle2, circle3, circle4);

            movingGroup.mouseup(() => { mouseUp(circle1, circle2, circle3, circle4); });
            movingGroup.hover(hoverOver, hoverOut);

            let timerId = setInterval(() => { animateTarget(movingGroup); }, 20);

            movingGroup.mousedown(() => { clear(timerId); });
        }

        var value = 0;
        var boolean = true;

        /**
         * Creates an animation for the target 
         */
        function animateTarget(movingGroup)
        {
            if (value < 500 && boolean)
            {
                for (var i = value; i < value + 10; i++)
                {
                    movingGroup.transform('t' + i + ',' + (0));
                }
            }
            else
            {
                if (value > -400 && !boolean)
                {
                    for (var i = value; i > value - 10; i--)
                    {
                        movingGroup.transform('t' + i + ',' + (0));
                    }
                }

            }

            value = i;

            // If we've hit the minimum, flip to going positive
            if (value == -400)
            {
                boolean = true;
            }

            // If we've hit the maximum, flip to going negative
            else if (value == 500)
            {
                boolean = false;
            }
        }

        /**
         * Resets all of the stats for the results page
         */
        function resetResults()
        {
            targetGreenCounter = 0;
            targetRedCounter = 0;
            targetWhiteCounter = 0;
            targetBlueCounter = 0;
            missesCounter = 0;

            document.getElementById("resultbutton").textContent = "Calculate score";
            document.getElementById("resultbutton").setAttribute('onclick','displayResults()')
        }

        /**
         * Displays the stats on the results page
         */
        function displayResults()
        {
            document.getElementById("results").innerHTML = "# of Hits: " +
                (targetRedCounter + targetWhiteCounter + targetGreenCounter + targetBlueCounter) + "<br>" +
                "# of Misses: " + missesCounter + "<br>" +
                "# of Green Hit: " + targetGreenCounter + "<br>" + "# of Red Hit: " +
                targetRedCounter + "<br>" + "# of Whites: " + targetWhiteCounter + "<br>" +
                "# of Blue Hit: " + targetBlueCounter;

            document.getElementById("resultbutton").textContent = "Reset score";
            document.getElementById("resultbutton").setAttribute('onclick','resetResults()')
        }

        /**
         * Flashes the entire target to match the accuracy of the user
         * and then increments which part of the target was shot for
         * the stats page
         */
        function circleClicked(givenCircle1, givenCircle2, givenCircle3, givenCircle4, color, accuracy)
        {
            // Flashes the colors
            givenCircle1.attr({
                fill: color,
            });
            givenCircle2.attr({
                fill: color,
            });
            givenCircle3.attr({
                fill: color,
            });
            givenCircle4.attr({
                fill: color,
            })

            // Checks if the user clicked on the blue portion of the target
            if (accuracy == "blue")
            {
                targetBlueCounter += 1;
            }

            // Checks if the user clicked on the white portion of the target
            else if (accuracy == "white")
            {
                targetWhiteCounter += 1;
            }

            // Checks if the user clicked on the red portion of the target
            else if (accuracy == "red")
            {
                targetRedCounter += 1;
            }

            // Checks if the user clicked on the green portion of the target
            else if (accuracy == "green")
            {
                targetGreenCounter += 1;
            }
        }

        /**
         * Stops the animation 
         */
        function clear(timerId)
        {
            clearInterval(timerId);
        }

        /**
         * Gets a random integer between the min and max
         */
        function getRandInteger(min, max)
        {
            return Math.floor(Math.random() * (max - min + 1) ) + min;
        }

        /**
         * Moves the target to a random coordinate of the provided range 
         */
        function shootingRange(shootingRangeGroup, providedCircle1, providedCircle2, providedCircle3, providedCircle4)
        {
            mouseUp(providedCircle1, providedCircle2, providedCircle3, providedCircle4);
            shootingRangeGroup.transform('t' + (getRandInteger(-400, 600)) + ',' + (getRandInteger(-150, 200)));
        }

        /**
         * Creates the colors for the target on the outermost circle
         */
        function setCircle1(providedCircle)
        {
            // Each circle's basic attributes
            providedCircle.attr({
                fill: "blue",
                stroke: "black",
                strokeWidth: 10
            });
        }

        /**
         * Creates the colors for the target on the second-outermost circle 
         */
        function setCircle2(providedCircle)
        {
            providedCircle.attr({
                fill: "white",
                stroke: "black",
                strokeWidth: 20
            });
        }

        /**
         * Creates the colors for the target on the second to innermost circle
         */
        function setCircle3(providedCircle)
        {
            providedCircle.attr({
                fill: "red",
                stroke: "black",
                strokeWidth: 10
            });
        }

        /**
         * Creates the colors for the target on the innermost circle
         */
         function setCircle4(providedCircle)
        {
            providedCircle.attr({
                fill: "forestgreen",
                stroke: "black",
                strokeWidth: 10
            });
        }

        /**
         * Sets all circles
         */
        function setCircles(providedCircle1, providedCircle2, providedCircle3, providedCircle4)
        {
            setCircle1(providedCircle1);
            setCircle2(providedCircle2);
            setCircle3(providedCircle3);
            setCircle4(providedCircle4);
        }

        /**
         * Touching for mobile devices
         */
        function mobileTouch()
        {
            circle1.attr({
                fill: "red",
                stroke: "red"
            });

            circle2.attr({
                fill: "red",
                stroke: "red"
            });

            circle3.attr({
                fill: "red",
                stroke: "red"
            });
        }

        /**
         * Dragging for PCs
         */
        function onDrag(directionX, directionY)
        {
            let transformDirectionX;
            let transformDirectionY;
            let snapInvertedMatrix = this.transform().diffMatrix.invert();

            transformDirectionX = snapInvertedMatrix.x(directionX, directionY);
            transformDirectionY = snapInvertedMatrix.y(directionX, directionY);
            this.transform("t" + [transformDirectionX, transformDirectionY] + this.data('ot'));
        }

        /**
         * Sets where to begin transforming for dragging
         */
        function onBegin()
        {
            this.data('ot', this.transform().local);
        }

        /**
         * Dynamic hover when user's cursor is over the svg image
         */
        function hoverOver()
        {
            document.body.style.cursor = "pointer";
        }

        /**
         * Dynamic hover out, when user's cursor moves off of svg image
         */
        function hoverOut()
        {
            document.body.style.cursor = "default";
        }



        /**
         * Dynamic option for svg when user releases click
         */
        function mouseUp(providedCircle1, providedCircle2, providedCircle3, providedCircle4)
        {
            providedCircle1.attr({
                fill: "blue",
                stroke: "black"
            });
            
            providedCircle2.attr({
                fill: "white",
                stroke: "black"
            })

            providedCircle3.attr({
                fill: "red",
                stroke: "black"
            })
            providedCircle4.attr({
                fill: "forestgreen",
                stroke: "black"
            })

            changeMovingText()
        }

        /**
         * Gives some text to the user 
         */
        function changeMovingText()
        {
            document.getElementById("moving-target-text").innerHTML = "Nicely done! Feel anything yet?";
        }

        /**
         * Places the quote from the API into the <p> with id "quote"
         */
        function embedQuote(quote, author)
        {
            document.getElementById('quote').innerHTML = quote
            document.getElementById('author').innerHTML = "- " + author;
        }

        /**
         * Gets a random quote from "https://api.quotable.io/random"
         */
        function fetchQuotes()
        {
            fetch("https://api.quotable.io/random").then((
                response) => response.json()).then((
                quote) => embedQuote(quote.content, quote.author));
        }

        main();