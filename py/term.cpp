/*------------------------------------------------------------------------------
| Copyright (c) 2013, Nucleic Development Team.
|
| Distributed under the terms of the Modified BSD License.
|
| The full license is in the file COPYING.txt, distributed with this software.
|-----------------------------------------------------------------------------*/
#include <sstream>
#include <Python.h>
#include "pythonhelpers.h"
#include "symbolics.h"
#include "types.h"
#include "util.h"


using namespace PythonHelpers;


static PyObject*
Term_new( PyTypeObject* type, PyObject* args, PyObject* kwargs )
{
	static const char *kwlist[] = { "variable", "coefficient", 0 };
	PyObject* pyvar;
	PyObject* pycoeff = 0;
	if( !PyArg_ParseTupleAndKeywords(
		args, kwargs, "O|O:__new__", const_cast<char**>( kwlist ),
		&pyvar, &pycoeff ) )
		return 0;
	if( !Variable::TypeCheck( pyvar ) )
		return py_expected_type_fail( pyvar, "Variable" );
	double coefficient = 1.0;
	if( pycoeff && !convert_to_double( pycoeff, coefficient ) )
	{
		if( PyErr_Occurred() )
			return 0;
		return py_expected_type_fail( pycoeff, "float, int, or long" );
	}
	PyObject* pyterm = PyType_GenericNew( type, args, kwargs );
	if( !pyterm )
		return 0;
	Term* self = reinterpret_cast<Term*>( pyterm );
	self->variable = newref( pyvar );
	self->coefficient = coefficient;
	return pyterm;
}


static void
Term_clear( Term* self )
{
	Py_CLEAR( self->variable );
}


static int
Term_traverse( Term* self, visitproc visit, void* arg )
{
	Py_VISIT( self->variable );
	return 0;
}


static void
Term_dealloc( Term* self )
{
	PyObject_GC_UnTrack( self );
	Term_clear( self );
	self->ob_type->tp_free( pyobject_cast( self ) );
}


static PyObject*
Term_repr( Term* self )
{
	std::stringstream stream;
	stream << self->coefficient << " * ";
	stream << reinterpret_cast<Variable*>( self->variable )->variable.name();
	return PyString_FromString( stream.str().c_str() );
}


static PyObject*
Term_variable( Term* self )
{
	return newref( self->variable );
}


static PyObject*
Term_coefficient( Term* self )
{
	return PyFloat_FromDouble( self->coefficient );
}


static PyObject*
Term_add( PyObject* first, PyObject* second )
{
	return BinaryInvoke<BinaryAdd, Term>()( first, second );
}


static PyObject*
Term_sub( PyObject* first, PyObject* second )
{
	return BinaryInvoke<BinarySub, Term>()( first, second );
}


static PyObject*
Term_mul( PyObject* first, PyObject* second )
{
	return BinaryInvoke<BinaryMul, Term>()( first, second );
}


static PyObject*
Term_div( PyObject* first, PyObject* second )
{
	return BinaryInvoke<BinaryDiv, Term>()( first, second );
}


static PyObject*
Term_neg( PyObject* value )
{
	return UnaryInvoke<UnaryNeg, Term>()( value );
}


static PyMethodDef
Term_methods[] = {
	{ "variable", ( PyCFunction )Term_variable, METH_NOARGS,
	  "Get the variable for the term." },
	{ "coefficient", ( PyCFunction )Term_coefficient, METH_NOARGS,
	  "Get the coefficient for the term." },
	{ 0 } // sentinel
};


static PyNumberMethods
Term_as_number = {
	(binaryfunc)Term_add,       /* nb_add */
	(binaryfunc)Term_sub,       /* nb_subtract */
	(binaryfunc)Term_mul,       /* nb_multiply */
	(binaryfunc)Term_div,       /* nb_divide */
	0,                          /* nb_remainder */
	0,                          /* nb_divmod */
	0,                          /* nb_power */
	(unaryfunc)Term_neg,        /* nb_negative */
	0,                          /* nb_positive */
	0,                          /* nb_absolute */
	0,                          /* nb_nonzero */
	0,                          /* nb_invert */
	0,                          /* nb_lshift */
	0,                          /* nb_rshift */
	0,                          /* nb_and */
	0,                          /* nb_xor */
	0,                          /* nb_or */
	0,                          /* nb_coerce */
	0,                          /* nb_int */
	0,                          /* nb_long */
	0,                          /* nb_float */
	0,                          /* nb_oct */
	0,                          /* nb_hex */
	0,                          /* nb_inplace_add */
	0,                          /* nb_inplace_subtract */
	0,                          /* nb_inplace_multiply */
	0,                          /* nb_inplace_divide */
	0,                          /* nb_inplace_remainder */
	0,                          /* nb_inplace_power */
	0,                          /* nb_inplace_lshift */
	0,                          /* nb_inplace_rshift */
	0,                          /* nb_inplace_and */
	0,                          /* nb_inplace_xor */
	0,                          /* nb_inplace_or */
	0,                          /* nb_floor_divide */
	0,                          /* nb_true_divide */
	0,                          /* nb_inplace_floor_divide */
	0,                          /* nb_inplace_true_divide */
	0,                          /* nb_index */
};


PyTypeObject Term_Type = {
	PyObject_HEAD_INIT( 0 )
	0,                                      /* ob_size */
	"pykiwi.Term",                          /* tp_name */
	sizeof( Term ),                         /* tp_basicsize */
	0,                                      /* tp_itemsize */
	(destructor)Term_dealloc,               /* tp_dealloc */
	(printfunc)0,                           /* tp_print */
	(getattrfunc)0,                         /* tp_getattr */
	(setattrfunc)0,                         /* tp_setattr */
	(cmpfunc)0,                             /* tp_compare */
	(reprfunc)Term_repr,                    /* tp_repr */
	(PyNumberMethods*)&Term_as_number,      /* tp_as_number */
	(PySequenceMethods*)0,                  /* tp_as_sequence */
	(PyMappingMethods*)0,                   /* tp_as_mapping */
	(hashfunc)0,                            /* tp_hash */
	(ternaryfunc)0,                         /* tp_call */
	(reprfunc)0,                            /* tp_str */
	(getattrofunc)0,                        /* tp_getattro */
	(setattrofunc)0,                        /* tp_setattro */
	(PyBufferProcs*)0,                      /* tp_as_buffer */
	Py_TPFLAGS_DEFAULT|Py_TPFLAGS_HAVE_GC|Py_TPFLAGS_BASETYPE|Py_TPFLAGS_CHECKTYPES, /* tp_flags */
	0,                                      /* Documentation string */
	(traverseproc)Term_traverse,            /* tp_traverse */
	(inquiry)Term_clear,                    /* tp_clear */
	(richcmpfunc)0,                         /* tp_richcompare */
	0,                                      /* tp_weaklistoffset */
	(getiterfunc)0,                         /* tp_iter */
	(iternextfunc)0,                        /* tp_iternext */
	(struct PyMethodDef*)Term_methods,      /* tp_methods */
	(struct PyMemberDef*)0,                 /* tp_members */
	0,                                      /* tp_getset */
	0,                                      /* tp_base */
	0,                                      /* tp_dict */
	(descrgetfunc)0,                        /* tp_descr_get */
	(descrsetfunc)0,                        /* tp_descr_set */
	0,                                      /* tp_dictoffset */
	(initproc)0,                            /* tp_init */
	(allocfunc)PyType_GenericAlloc,         /* tp_alloc */
	(newfunc)Term_new,                      /* tp_new */
	(freefunc)PyObject_GC_Del,              /* tp_free */
	(inquiry)0,                             /* tp_is_gc */
	0,                                      /* tp_bases */
	0,                                      /* tp_mro */
	0,                                      /* tp_cache */
	0,                                      /* tp_subclasses */
	0,                                      /* tp_weaklist */
	(destructor)0                           /* tp_del */
};


int import_term()
{
	return PyType_Ready( &Term_Type );
}