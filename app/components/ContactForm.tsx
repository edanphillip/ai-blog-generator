'use client'
import { Component } from 'react';

class ContactForm extends Component {
  state = {
    name: '',
    email: '',
    subject: '',
    message: '',
    dark: true
  };


  // const[IsLoading, setIsLoading] = useState(0);
  handleChange = (e: any) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  handleSubmit = async (e: any) => {
    e.preventDefault();
    // You can handle the form submission logic here
    // For simplicity, let's just log the form data for now
    console.log('Form Data:', this.state);
    await fetch('/api/emails', {
      method: 'POST',
      body: JSON.stringify({
        firstName: this.state.name,
        email: this.state.email,
        subject: this.state.subject,
        message: this.state.message
      })
    })
  };

  render() {
    return (
      <div id="contact" className=" rounded-t-3xl mt-2 w-full max-w-xl mx-auto   left-0 right-0 ">
        <section className=" ">
          <div className=" py-8 lg:p-8 px-4 mx-auto max-w-screen-xl">
            <p className="text-xl font-light text-center text-accent-content   ">Need Assistance?</p>
            <h2 className=" mb-4 text-4xl tracking-tight font-extrabold text-center text-accent-content -200 dark:text-accent-content Text-light">Contact Us</h2>
            <form onSubmit={this.handleSubmit} className="space-y-4" action="#" >
              <div>
                <label className="block mb-1 text-sm font-medium text-accent-content -200 dark:text-accent-content -200" htmlFor="name">Name
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={this.state.name}
                    onChange={this.handleChange}
                    required
                    className="placeholder:italic placeholder:text-sm placeholder:text-accent/60 placeholder:blur-[0.5px] border-2 input input-accent text-accent   border-accent-content p-2   rounded-lg  w-full " placeholder="John Doe" />
                </label>
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-accent-content -200 dark:text-accent-content -200" htmlFor="email">Your Email
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={this.state.email}
                    onChange={this.handleChange}
                    required
                    className="placeholder:italic placeholder:text-sm placeholder:text-accent/60 placeholder:blur-[0.5px] border-2 input input-accent text-accent   border-accent-content p-2   rounded-lg  w-full "
                    placeholder="email@example.com" />
                </label>
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-accent-content -200 dark:text-accent-content -200" htmlFor="subject">Subject
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={this.state.subject}
                    onChange={this.handleChange}
                    className="placeholder:italic placeholder:text-sm placeholder:text-accent/60 placeholder:blur-[0.5px] border-2 input input-accent text-accent   border-accent-content p-2   rounded-lg  w-full " placeholder="Please help with ..." required />
                </label>
              </div>
              <div className="sm:col-span-2">
                <label className="block mb-1 text-sm font-medium text-accent-content dark:text-accent-content " htmlFor="message">Your message
                  <textarea
                    id="message"
                    name="message"
                    value={this.state.message}
                    onChange={this.handleChange}
                    className="h-32 resize-y placeholder:italic placeholder:text-sm placeholder:text-accent/60 placeholder:blur-[0.5px] border-2 input input-accent text-accent   border-accent-content p-2   rounded-lg  w-full " placeholder="Leave a message..."></textarea>
                </label>
              </div>
              <div className="mt-6 flex items-center justify-center gap-4">
                <button type="submit" className="transform rounded-lg bg-accent btn p-4 text-accent-content Text-light font-bold transition-colors hover:bg-primary/90">Send Message</button>
              </div>
            </form>
          </div>
        </section >
      </div >
    );
  }
}

export default ContactForm;
