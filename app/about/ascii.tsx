import React from 'react';

const asciiArt = `
                                                    ######
                                                ##-       ##     -######
                                              ##   +#####  ######      +##
                                            ##   ##         ##    ##
                                            #+ ###   +#         #######   -#
                                          # + #                            ##
                                        ## #             .#                ##
                                        #+ ##     -      ##                 -##
                                        #-#  #      ##    #             - ####  ###
                                      ##  # ##         +##            ##    #### .##
      ###                              # -#  # #.    + ###             #           ##
         ################+.           +# #. ##############            #            ##
        #. +#######+####+.############    ##        .###            #.             ##
      ### .##################-     #######             ##         ##           ##    ###
      # #         #######################     #.        ######   ##           ##  ##    ##
      # #               +###########-.#+      ##         #   #####            #          ##
      # #                      .######                   ###-   ##          ##        #  ##
      # #                          #           ####             #         ##          #+ #.
      ###                        ##             .#####+ #.    .#         ##          ######-
        ##                          #         ###.########### #        #           #############
        ##                              #     ####    ###.  +# ### #+   ##+         ######++########## ###+
      ####                                 #           ##-  ###############      #######################  ######
      +# #                                         #     ##+.# -#++### +## ########################++###  # # #- +##########
                                                     #                               .################  + #      #        ###
                                                      #                              +##             +##########-#####    . -  ###+
                                                                                    ##                          ###-################
                                                                                    ##
                                      ##+                                           #+
                                      ####                                         ##
                                       ####                                       ##
                                       ####                                      #
                                        ####                    ##           . ##
                                          ####             -## ##  ##          ###
                                          .####  #.       .#        ##     ###-##
                                            -###  .#         ##         ##-  ###
                                              #####  ###     ## #+    #     ##
                                                ####   .     #             ##-
                                                ## ##  #  ## #             ###
                                                ##  ####     +              ##
                                                ##    #. #  #               ###
                                                ##     #   ##                ##
                                                #      #                      #
                                              ##                             #
                                              ##                            ##
`;

const AsciiArt = () => {
  return (
    <pre
      style={{
        fontSize: '8px',
        fontFamily: 'monospace',
        whiteSpace: 'pre-wrap',
        textAlign: 'center',
        wordBreak: 'break-word',
      }}
    >
      {asciiArt}
    </pre>
  );
};

export default AsciiArt;
