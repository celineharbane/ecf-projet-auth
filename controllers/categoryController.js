const Category = require('../models/Category');
const { supabase } = require('../config/database');

class CategoryController {
  /**
   * Récupérer toutes les catégories
   */
  static async getAllCategories(req, res) {
    try {
      const withCounts = req.query.with_counts === 'true';
      
      let categories;
      if (withCounts) {
        categories = await Category.findAllWithCounts();
      } else {
        categories = await Category.findAll();
      }

      res.json({
        success: true,
        categories,
        count: categories.length
      });
    } catch (error) {
      console.error('Erreur getAllCategories:', error);
      res.status(500).json({ 
        error: 'Erreur lors de la récupération des catégories',
        code: 'CATEGORIES_FETCH_ERROR'
      });
    }
  }

  /**
   * Récupérer une catégorie par ID
   */
  static async getCategoryById(req, res) {
    try {
      const { id } = req.params;
      
      const category = await Category.findById(id);
      if (!category) {
        return res.status(404).json({ 
          error: 'Catégorie non trouvée',
          code: 'CATEGORY_NOT_FOUND'
        });
      }

      // Compter le nombre d'annonces dans cette catégorie
      const { count, error } = await supabase
        .from('annonces')
        .select('*', { count: 'exact', head: true })
        .eq('category_id', id);

      if (error) {
        console.error('Erreur count annonces:', error);
      }

      res.json({
        success: true,
        category: {
          ...category,
          annonces_count: count || 0
        }
      });
    } catch (error) {
      console.error('Erreur getCategoryById:', error);
      res.status(500).json({ 
        error: 'Erreur lors de la récupération de la catégorie',
        code: 'CATEGORY_FETCH_ERROR'
      });
    }
  }

  /**
   * Créer une nouvelle catégorie (admin seulement)
   */
  static async createCategory(req, res) {
    try {
      const { nom } = req.body;

      // Vérifier si le nom existe déjà
      const nameExists = await Category.nameExists(nom);
      if (nameExists) {
        return res.status(400).json({ 
          error: 'Cette catégorie existe déjà',
          code: 'CATEGORY_ALREADY_EXISTS'
        });
      }

      const category = await Category.create({ nom });
      
      res.status(201).json({
        success: true,
        message: 'Catégorie créée avec succès',
        category
      });
    } catch (error) {
      console.error('Erreur createCategory:', error);
      
      if (error.code === '23505') {
        return res.status(400).json({ 
          error: 'Cette catégorie existe déjà',
          code: 'CATEGORY_ALREADY_EXISTS'
        });
      }
      
      res.status(500).json({ 
        error: 'Erreur lors de la création de la catégorie',
        code: 'CATEGORY_CREATE_ERROR'
      });
    }
  }

  /**
   * Mettre à jour une catégorie (admin seulement)
   */
  static async updateCategory(req, res) {
    try {
      const { id } = req.params;
      const { nom } = req.body;

      // Vérifier que la catégorie existe
      const existingCategory = await Category.findById(id);
      if (!existingCategory) {
        return res.status(404).json({ 
          error: 'Catégorie non trouvée',
          code: 'CATEGORY_NOT_FOUND'
        });
      }

      // Vérifier si le nouveau nom existe déjà (sauf pour cette catégorie)
      const nameExists = await Category.nameExists(nom, id);
      if (nameExists) {
        return res.status(400).json({ 
          error: 'Ce nom de catégorie est déjà utilisé',
          code: 'CATEGORY_NAME_EXISTS'
        });
      }

      const updatedCategory = await Category.updateById(id, { nom });
      
      res.json({
        success: true,
        message: 'Catégorie mise à jour avec succès',
        category: updatedCategory
      });
    } catch (error) {
      console.error('Erreur updateCategory:', error);
      
      if (error.code === '23505') {
        return res.status(400).json({ 
          error: 'Ce nom de catégorie est déjà utilisé',
          code: 'CATEGORY_NAME_EXISTS'
        });
      }
      
      res.status(500).json({ 
        error: 'Erreur lors de la mise à jour de la catégorie',
        code: 'CATEGORY_UPDATE_ERROR'
      });
    }
  }

  /**
   * Supprimer une catégorie (admin seulement)
   */
  static async deleteCategory(req, res) {
    try {
      const { id } = req.params;

      // Vérifier que la catégorie existe
      const category = await Category.findById(id);
      if (!category) {
        return res.status(404).json({ 
          error: 'Catégorie non trouvée',
          code: 'CATEGORY_NOT_FOUND'
        });
      }

      await Category.deleteById(id);
      
      res.json({
        success: true,
        message: 'Catégorie supprimée avec succès'
      });
    } catch (error) {
      console.error('Erreur deleteCategory:', error);
      
      if (error.message.includes('annonce(s) y sont associées')) {
        return res.status(400).json({ 
          error: error.message,
          code: 'CATEGORY_HAS_ANNONCES'
        });
      }
      
      res.status(500).json({ 
        error: 'Erreur lors de la suppression de la catégorie',
        code: 'CATEGORY_DELETE_ERROR'
      });
    }
  }

  /**
   * Rechercher des catégories par nom
   */
  static async searchCategories(req, res) {
    try {
      const { q: searchTerm } = req.query;
      
      if (!searchTerm || searchTerm.length < 2) {
        return res.status(400).json({ 
          error: 'Le terme de recherche doit contenir au moins 2 caractères',
          code: 'INVALID_SEARCH_TERM'
        });
      }

      const categories = await Category.search(searchTerm);
      
      res.json({
        success: true,
        categories,
        searchTerm,
        count: categories.length
      });
    } catch (error) {
      console.error('Erreur searchCategories:', error);
      res.status(500).json({ 
        error: 'Erreur lors de la recherche de catégories',
        code: 'CATEGORY_SEARCH_ERROR'
      });
    }
  }

  /**
   * Récupérer les catégories les plus populaires
   */
  static async getPopularCategories(req, res) {
    try {
      const limit = parseInt(req.query.limit) || 5;
      
      if (limit > 20) {
        return res.status(400).json({ 
          error: 'La limite maximum est de 20 catégories',
          code: 'LIMIT_EXCEEDED'
        });
      }

      const categories = await Category.getMostPopular(limit);
      
      res.json({
        success: true,
        categories,
        limit
      });
    } catch (error) {
      console.error('Erreur getPopularCategories:', error);
      res.status(500).json({ 
        error: 'Erreur lors de la récupération des catégories populaires',
        code: 'POPULAR_CATEGORIES_ERROR'
      });
    }
  }

  /**
   * Récupérer les statistiques des catégories
   */
  static async getCategoriesStats(req, res) {
    try {
      // Nombre total de catégories
      const { count: totalCategories, error: totalError } = await supabase
        .from('categories')
        .select('*', { count: 'exact', head: true });

      if (totalError) throw totalError;

      // Catégories avec le plus d'annonces
      const { data: categoriesWithCounts, error: countsError } = await supabase
        .from('categories')
        .select(`
          *,
          annonces(count)
        `)
        .order('nom');

      if (countsError) throw countsError;

      // Transformer les données
      const categoriesStats = categoriesWithCounts?.map(category => ({
        id: category.id,
        nom: category.nom,
        annonces_count: category.annonces?.[0]?.count || 0
      })).sort((a, b) => b.annonces_count - a.annonces_count) || [];

      // Catégorie la plus populaire
      const mostPopular = categoriesStats[0] || null;

      // Catégories vides
      const emptyCategories = categoriesStats.filter(cat => cat.annonces_count === 0);

      res.json({
        success: true,
        stats: {
          total_categories: totalCategories || 0,
          most_popular: mostPopular,
          empty_categories_count: emptyCategories.length,
          categories_distribution: categoriesStats
        }
      });
    } catch (error) {
      console.error('Erreur getCategoriesStats:', error);
      res.status(500).json({ 
        error: 'Erreur lors de la récupération des statistiques des catégories',
        code: 'CATEGORIES_STATS_ERROR'
      });
    }
  }

  /**
   * Récupérer les annonces d'une catégorie
   */
  static async getCategoryAnnonces(req, res) {
    try {
      const { id } = req.params;

      // Vérifier que la catégorie existe
      const category = await Category.findById(id);
      if (!category) {
        return res.status(404).json({ 
          error: 'Catégorie non trouvée',
          code: 'CATEGORY_NOT_FOUND'
        });
      }

      const pagination = {
        page: req.query.page || 1,
        limit: req.query.limit || 20
      };

      const filters = {
        category_id: id,
        localite: req.query.localite,
        search: req.query.search,
        min_prix: req.query.min_prix,
        max_prix: req.query.max_prix
      };

      // Utiliser le controller des annonces pour récupérer les annonces
      const Annonce = require('../models/Annonce');
      const result = await Annonce.findAll(filters, pagination);

      res.json({
        success: true,
        category,
        ...result
      });
    } catch (error) {
      console.error('Erreur getCategoryAnnonces:', error);
      res.status(500).json({ 
        error: 'Erreur lors de la récupération des annonces de la catégorie',
        code: 'CATEGORY_ANNONCES_ERROR'
      });
    }
  }
}

module.exports = CategoryController;