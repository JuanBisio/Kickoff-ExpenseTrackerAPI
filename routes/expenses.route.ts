import { Router } from "express";
import { Expense } from "../models/Expense.ts";

const router = Router();

//Registrar un gasto.
router.post("/", async (req, res) => {
  try {
    const { amount, paid, date, description } = req.body;

    const expense = await Expense.create({ amount, paid, date, description });
    res.status(201).json(expense);
  } catch (err) {
    res.status(400).json({ error: "Datos inválidos" });
  }
});

// obtener un gasto por id 
router.get("/:id", async (req, res)=>{
  const { id } = req.params;
  const exp = await Expense.findById(id);
  if (!exp) return res.status(404).json({err: "El gasto no se encontro"})
  res.json(exp);
})

// Modificar una descripcion. por id 
router.patch('/:id/description', async (req, res)=>{
  const { id } = req.params;
  const { description } = req.body;
  if (!description) return res.status(400).json({err: 'Falta la descripcion'});
  const expUpdate = await Expense.findByIdAndUpdate(id, {description}, {new:true});
  if (!expUpdate) return res.status(404).json({err: 'El gasto no se encontro'});
  res.json(expUpdate); 
})

//Marcar como pagado un gasto.

router.patch('/:id/paid', async (req, res)=>{
  const { id } = req.params;
  const { paid } = req.body;
  if (!paid) return res.status(400).json({err:'Falta el pago'})
  
  const expUpdate = await Expense.findByIdAndUpdate(id, {paid}, {new:true} );
  if (!expUpdate) return res.status(404).json({err: 'El pago no se encontro'});
  res.json(expUpdate); 

});

// Historico de gastos, con filtros y paginacion
router.get("/", async (req, res) => {
  try {
    const { from, to, paid = "all", desc, page = "1", limit = "10" } = req.query as any;

    // Filtro de búsqueda
    const filter: any = {};
    if (from) filter.date = { ...filter.date, $gte: new Date(from) };
    if (to) filter.date = { ...filter.date, $lte: new Date(to) };
    //filter.algo agrega una propiedad al objeto filter, si existe la actualiza 
    if (paid !== "all") filter.paid = paid === "true";
    if (desc) filter.description = { $regex: desc, $options: "i" }; //$regex: busqueda por patron (expresion regular) en la desc 

    // Paginación
    const pageNum = Math.max(parseInt(page, 10), 1);
    const limitNum = Math.min(Math.max(parseInt(limit, 10), 1), 100);
    const skip = (pageNum - 1) * limitNum;

    // Consulta
    const [items, total] = await Promise.all([
      Expense.find(filter).sort({ date: -1, _id: -1 }).skip(skip).limit(limitNum),
      Expense.countDocuments(filter),
    ]);
    // console.log(items);
    console.log(filter) ;

    res.json({
      page: pageNum,
      limit: limitNum,
      total,
      pages: Math.ceil(total / limitNum),
      items,
    });
  } catch (err) {
    res.status(500).json({ error: "Error al obtener los gastos" });
  }
});


//Obtener el total de gastos, permitiendo filtro por fecha desde y hasta, pagados, no pagados, o todos y paginacion.

router.get("/summary/total", async (req, res) => {
  const { from, to, paid = "all" } = req.query as any;
  const match: any = {};
  if (from || to) {
    match.date = {};
    if (from) match.date.$gte = new Date(from);
    if (to) match.date.$lte = new Date(to);
  }
  if (paid !== "all") match.paid = paid === "true";

  const [result] = await Expense.aggregate([
    { $match: match }, // Filtrar segun los criterios
    { $group: { _id: null, totalAmount: { $sum: "$amount" }, count: { $sum: 1 } } },
  ]);

  res.json({ totalAmount: result?.totalAmount || 0, count: result?.count || 0 });
});



export default router;
