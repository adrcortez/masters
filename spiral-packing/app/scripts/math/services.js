'use strict';


angular
	.module('math.services', [])

	.service('$math', [
        function () {

			// Contants (private)
			var factorials = [
				1, 2, 6, 24, 120, 720, 5040, 40320, 362880, 3628800, 39916800,
				479001600, 6227020800, 87178291200, 1307674368000,
				20922789888000, 355687428096000, 6402373705728000
			];


            // Create a new object that extends the Math object
            var math = Object.create(Math);

            // Extend the new math object
            angular.extend(math, {

                // Constants
                EPSILON: Number.EPSILON || 2.2204460492503130808472633361816E-16,


                // Functions
                squaredDistance: function (x1, y1, x2, y2) {
                    return (x2-=x1)*x2 + (y2-=y1)*y2;
                },

                euclideanDistance: function (x1, y1, x2, y2) {
                    return Math.sqrt( squaredDistance(x1, y1, x2, y2) );
                },

				factorial: function (n) {
					return factorials[n] || Math.MAX_SAFE_INTEGER;
				},

				choose: function (n, i) {
					return this.factorial(n) / (this.factorial(i) * this.factorial(n-i));
				}
            });

            // Return the math extension
            return math;
        }
    ]);
