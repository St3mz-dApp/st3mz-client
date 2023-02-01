import { Link } from "react-router-dom";
import { APP_NAME } from "../Config";
import { PRIVACY_ROUTE } from "../navigation/Routes";

export const TermsPage = (): JSX.Element => {
  return (
    <div>
      <h1 className="pb-2 text-5xl font-bold">Terms and Conditions of Use</h1>
      <h2 className="pt-4 text-3xl font-bold">1. Terms</h2>
      <p className="pt-1">
        By accessing this Website, accessible from https://st3mz-dapp.web.app,
        you are agreeing to be bound by these Website Terms and Conditions of
        Use and agree that you are responsible for the agreement with any
        applicable local laws. If you disagree with any of these terms, you are
        prohibited from accessing this site. The materials contained in this
        Website are protected by copyright and trade mark law.
      </p>
      <h2 className="pt-4 text-3xl font-bold">2. Use License</h2>
      <p className="pt-1">
        Permission is granted to temporarily download one copy of the materials
        on {APP_NAME}'s Website for personal, non-commercial transitory viewing
        only. This is the grant of a license, not a transfer of title, and under
        this license you may not:
      </p>
      <ul className="list-disc pl-8">
        <li>modify or copy the materials;</li>
        <li>
          use the materials for any commercial purpose or for any public
          display;
        </li>
        <li>
          attempt to reverse engineer any software contained on {APP_NAME}'s
          Website;
        </li>
        <li>
          remove any copyright or other proprietary notations from the
          materials; of
        </li>
        <li>
          transferring the materials to another person or "mirror" the materials
          on any other server.
        </li>
      </ul>
      <p className="pt-1">
        This will let {APP_NAME} to terminate upon violations of any of these
        restrictions. Upon termination, your viewing right will also be
        terminated and you should destroy any downloaded materials in your
        possession whether it is printed or electronic format.
      </p>
      <h2 className="pt-4 text-3xl font-bold">
        3. Disclaimer of warranties and Limitation of liability
      </h2>
      <p className="pt-1">
        This website is provided by the authors "as is" and any express or
        implied warranties, including, but not limited to, the implied
        warranties of merchantability and fitness for a particular purpose are
        disclaimed. In no event shall the authors be liable for any direct,
        indirect, incidental, special, exemplary, or consequential damages
        (including, but not limited to, procurement of substitute goods or
        services; loss of use, data, or profits; or business interruption)
        however caused and on any theory of liability, whether in contract,
        strict liability, or tort (including negligence or otherwise) arising in
        any way out of the use of this website, even if advised of the
        possibility of such damage.
      </p>
      <h2 className="pt-4 text-3xl font-bold">4. Limitations </h2>
      <p className="pt-1">
        {APP_NAME} or its suppliers will not be hold accountable for any damages
        that will arise with the use or inability to use the materials on
        {APP_NAME}'s Website, even if {APP_NAME} or an authorize representative
        of this Website has been notified, orally or written, of the possibility
        of such damage. Some jurisdiction does not allow limitations on implied
        warranties or limitations of liability for incidental damages, these
        limitations may not apply to you.
      </p>
      <h2 className="pt-4 text-3xl font-bold">5. Revisions and Errata </h2>
      <p className="pt-1">
        The materials appearing on {APP_NAME}'s Website may include technical,
        typographical, {APP_NAME} or photographic errors. {APP_NAME} will not
        promise that any of the materials in this Website are accurate,
        complete, or current. {APP_NAME} may change the materials contained on
        its Website at any time without notice. {APP_NAME} does not make any
        commitment to update the materials.
      </p>
      <h2 className="pt-4 text-3xl font-bold">6. Links</h2>
      <p className="pt-1">
        {APP_NAME} has not reviewed all of the sites linked to its Website and
        is not responsible for the contents of any such linked site. The
        presence of any link does not imply endorsement by {APP_NAME} of the
        site. The use of any linked website is at the user's own risk.
      </p>
      <h2 className="pt-4 text-3xl font-bold">
        7. Site Terms of Use Modifications
      </h2>
      <p className="pt-1">
        {APP_NAME} may revise these Terms of Use for its Website at any time
        without prior notice. By using this Website, you are agreeing to be
        bound by the current version of these Terms and Conditions of Use.
      </p>
      <h2 className="pt-4 text-3xl font-bold">8. Your Privacy</h2>
      <p className="pt-1">
        Please read our <Link to={PRIVACY_ROUTE}>Privacy Policy</Link>.
      </p>
      <h2 className="pt-4 text-3xl font-bold">9. Copyright Complaints </h2>
      <p className="pt-1">
        {APP_NAME} respects the intellectual property of others. If you believe
        that your work has been copied in a way that constitutes copyright
        infringement, please
        <a href="mailto:st3mz@proton.me"> email us</a>.
      </p>
    </div>
  );
};
