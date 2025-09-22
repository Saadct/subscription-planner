import { TestBed } from '@angular/core/testing';
import { CategoryService } from './category.service';
import { AddCategory, Category } from '../models/category.model';

describe('CategoryService', () => {
    let service: CategoryService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(CategoryService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should return all categories via getAllCategories', async () => {
        const categories = await service.getAllCategories();
        expect(categories.length).toBe(10);
        expect(categories[0].label).toBe('Divertissement');
    });

    it('should return a category by ID', async () => {
        const cat = await service.getSubscriptionById('1');
        expect(cat).toBeDefined();
        expect(cat?.label).toBe('Divertissement');
    });

    it('should create a new category', async () => {
        const data: AddCategory = { label: 'Test Category' };
        const newCat = await service.createCategory(data);

        expect(newCat).toBeDefined();
        expect(newCat.id).toBeTruthy();
        expect(newCat.label).toBe('Test Category');

        const allCats = await service.getAllCategories();
        expect(allCats.find(c => c.id === newCat.id)).toBeDefined();
    });

    it('should update an existing category', async () => {
        const updates: Partial<Category> = { label: 'Updated Label', active: false };
        const updatedCat = await service.updateCategory('1', updates);

        expect(updatedCat).toBeDefined();
        expect(updatedCat?.label).toBe('Updated Label');
        expect(updatedCat?.active).toBe(false);
    });

    it('should return undefined when updating non-existing category', async () => {
        const updatedCat = await service.updateCategory('999', { label: 'Nope' });
        expect(updatedCat).toBeUndefined();
    });

    it('should delete a category', async () => {
        const result = await service.deleteCategory('1');
        expect(result).toBe(true);

        const cat = await service.getSubscriptionById('1');
        expect(cat).toBeUndefined();
    });

    it('should return false when deleting non-existing category', async () => {
        const result = await service.deleteCategory('999');
        expect(result).toBe(false);
    });

    it('should return only active categories', () => {
        const activeCategories = service.getActiveCategories();
        expect(activeCategories.every(c => c.active)).toBe(true);
    });

    it('computed allCategories should match categories', () => {
        const cats = service.allCategories();
        expect(cats.length).toBeGreaterThan(0);
    });

    it('getCategoriesComputed should return a computed signal', () => {
        const comp = service.getCategoriesComputed();
        expect(comp()).toEqual(service.allCategories());
    });
});
