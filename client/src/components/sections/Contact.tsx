import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function Contact() {
  return (
    <section id="contact" className="py-24 bg-secondary/5">
      <div className="container mx-auto px-6">
        <div className="bg-white rounded-3xl overflow-hidden shadow-2xl grid grid-cols-1 lg:grid-cols-2">
          
          <div className="p-12 flex flex-col justify-center">
            <h2 className="text-4xl font-serif font-bold mb-6">Visit Us</h2>
            <p className="text-muted-foreground mb-8">
              Ready to indulge? Find us in the heart of the city or book a table for a special occasion.
            </p>
            
            <div className="space-y-6">
               <div className="space-y-2">
                 <label className="text-sm font-bold uppercase tracking-wider text-primary">Location</label>
                 <p className="text-lg">123 Sweet Street, Paris</p>
               </div>
               <div className="space-y-2">
                 <label className="text-sm font-bold uppercase tracking-wider text-primary">Hours</label>
                 <p className="text-lg">Mon - Sun: 10am - 10pm</p>
               </div>
            </div>
          </div>

          <div className="bg-primary/5 p-12">
            <h3 className="text-2xl font-serif font-bold mb-6">Book a Table</h3>
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                   <label className="text-sm font-medium">Name</label>
                   <Input placeholder="John Doe" className="bg-white border-transparent focus:border-primary" />
                </div>
                <div className="space-y-2">
                   <label className="text-sm font-medium">Phone</label>
                   <Input placeholder="+1 234 567 890" className="bg-white border-transparent focus:border-primary" />
                </div>
              </div>
              <div className="space-y-2">
                 <label className="text-sm font-medium">Email</label>
                 <Input type="email" placeholder="john@example.com" className="bg-white border-transparent focus:border-primary" />
              </div>
              <div className="space-y-2">
                 <label className="text-sm font-medium">Message</label>
                 <Textarea placeholder="Any special requests?" className="bg-white border-transparent focus:border-primary min-h-[120px]" />
              </div>
              <Button className="w-full bg-primary text-white hover:bg-primary/90 mt-4 rounded-full h-12">
                Send Request
              </Button>
            </form>
          </div>

        </div>
      </div>
    </section>
  );
}
