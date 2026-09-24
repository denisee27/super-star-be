export function validate(schema, options = {}) {
  return (req, res, next) => {
    const result = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query,
    });

    if (!result.success) {
      const issues = result.error.issues ?? result.error.errors ?? [];
      return res.status(400).json({
        success: false,
        error: "Validation failed",
        details: issues.map((e) => ({
          path: e.path.join("."),
          message: e.message,
        })),
      });
    }

    if (options.assign) {
      req.body = result.data.body ?? req.body;
      req.params = result.data.params ?? req.params;
      // Express 5: req.query is a getter, use Object.defineProperty to override
      if (result.data.query) {
        Object.defineProperty(req, "query", {
          value: result.data.query,
          writable: true,
          configurable: true,
        });
      }
    }

    next();
  };
}
