import '@/Scss/Main.scss';
import OfferForm from './Extensions/Form/OfferForm';
import Select from './Extensions/Form/Select';
import FormValidation from './Extensions/Form/FormValidation';
import Header from './Layout/Header';
import Footer from './Layout/Footer';
import ContentBlocks from './Extensions/Frontend/ContentBlocks';
import Plugins from './Extensions/Frontend/Plugins/Person';
import BlogFilter from './Extensions/Blog/blogFilter';

window.addEventListener('load', () => {
    new Header();
    new Footer();
    new OfferForm();
    new Select();
    new FormValidation();
    new ContentBlocks();
    new Plugins();
    new BlogFilter();

    window.dispatchEvent(new Event('scroll'));
});
