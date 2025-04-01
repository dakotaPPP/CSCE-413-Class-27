/**
 * @name Detect XSS vulnerabilities in innerHTML assignments
 * @description Finds instances where user-controlled input is assigned to innerHTML, 
 * leading to potential XSS vulnerabilities.
 * @kind problem
 * @problem.severity error
 * @id javascript/xss/innerhtml-assignment
 */

import javascript

/**
 * A data flow configuration that tracks user-controlled input.
 */
class UserControlledInput extends DataFlow::Configuration {
  UserControlledInput() { this = "UserControlledInput" }

  override predicate isSource(DataFlow::Node source) {
    // Sources of user-controlled input
    source = DOM::documentRef().getAMethodCall("getElementById").getAPropertyRead("value") or
    source = DOM::domValueRef()
  }

  override predicate isSink(DataFlow::Node sink) {
    // Sinks that assign to innerHTML
    exists(DataFlow::PropWrite pw | 
      pw.getPropertyName() = "innerHTML" and 
      pw.getRhs() = sink
    )
  }
}

from UserControlledInput cfg, DataFlow::Node source, DataFlow::Node sink
where cfg.hasFlow(source, sink)
select sink, "Potential XSS vulnerability: User-controlled input assigned to innerHTML."